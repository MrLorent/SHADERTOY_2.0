THREE.ShaderChunk[ 'pathtracing_uniforms_and_defines' ] = `
uniform bool uCameraIsMoving;
uniform bool uSceneIsDynamic;
uniform float uEPS_intersect;
uniform float uTime;
uniform float uSampleCounter;
uniform float uFrameCounter;
uniform float uULen;
uniform float uVLen;
uniform float uApertureSize;
uniform float uFocusDistance;
uniform float uSamplesPerFrame;
uniform float uFrameBlendingAmount;
uniform vec2 uResolution;
uniform vec2 uRandomVec2;
uniform mat4 uCameraMatrix;
uniform sampler2D tPreviousTexture;
uniform sampler2D tBlueNoiseTexture;
in vec2 vUv;
#define PI               3.14159265358979323
#define TWO_PI           6.28318530717958648
#define FOUR_PI          12.5663706143591729
#define ONE_OVER_PI      0.31830988618379067
#define ONE_OVER_TWO_PI  0.15915494309
#define ONE_OVER_FOUR_PI 0.07957747154594767
#define PI_OVER_TWO      1.57079632679489662
#define ONE_OVER_THREE   0.33333333333333333
#define E                2.71828182845904524
#define INFINITY         1000000.0
#define SPOT_LIGHT -2
#define POINT_LIGHT -1
#define LIGHT 0
#define DIFF 1
#define REFR 2
#define SPEC 3
#define COAT 4
#define CARCOAT 5
#define TRANSLUCENT 6
#define SPECSUB 7
#define CHECK 8
#define WATER 9
#define PBR_MATERIAL 10
#define WOOD 11
#define SEAFLOOR 12
#define TERRAIN 13
#define CLOTH 14
#define LIGHTWOOD 15
#define DARKWOOD 16
#define PAINTING 17
#define METALCOAT 18
`;


THREE.ShaderChunk[ 'pathtracing_sphere_intersect' ] = `
/* bool solveQuadratic(float A, float B, float C, out float t0, out float t1)
{
	float discrim = B * B - 4.0 * A * C;
    
	if (discrim < 0.0)
        	return false;
    
	float rootDiscrim = sqrt(discrim);
	float Q = (B > 0.0) ? -0.5 * (B + rootDiscrim) : -0.5 * (B - rootDiscrim); 
	// float t_0 = Q / A; 
	// float t_1 = C / Q;
	// t0 = min( t_0, t_1 );
	// t1 = max( t_0, t_1 );
	t1 = Q / A; 
	t0 = C / Q;
	
	return true;
} */
// optimized algorithm for solving quadratic equations developed by Dr. Po-Shen Loh -> https://youtu.be/XKBX0r3J-9Y
// Adapted to root finding (ray t0/t1) for all quadric shapes (sphere, ellipsoid, cylinder, cone, etc.) by Erich Loftis
void solveQuadratic(float A, float B, float C, out float t0, out float t1)
{
	float invA = 1.0 / A;
	B *= invA;
	C *= invA;
	float neg_halfB = -B * 0.5;
	float u2 = neg_halfB * neg_halfB - C;
	float u = u2 < 0.0 ? neg_halfB = 0.0 : sqrt(u2);
	t0 = neg_halfB - u;
	t1 = neg_halfB + u;
}

//-----------------------------------------------------------------------------
float SphereIntersect( float rad, vec3 pos, vec3 rayOrigin, vec3 rayDirection )
//-----------------------------------------------------------------------------
{
	float t0, t1;
	vec3 L = rayOrigin - pos;
	float a = dot( rayDirection, rayDirection );
	float b = 2.0 * dot( rayDirection, L );
	float c = dot( L, L ) - (rad * rad);
	solveQuadratic(a, b, c, t0, t1);
	return t0 > 0.0 ? t0 : t1 > 0.0 ? t1 : INFINITY;
}
`;




THREE.ShaderChunk[ 'pathtracing_box_intersect' ] = `
//-----------------------------------------------------------------------------------------------------------------------------
float BoxIntersect( vec3 minCorner, vec3 maxCorner, vec3 rayOrigin, vec3 rayDirection, out vec3 normal, out bool isRayExiting )
//-----------------------------------------------------------------------------------------------------------------------------
{
	vec3 invDir = 1.0 / rayDirection;
	vec3 near = (minCorner - rayOrigin) * invDir;
	vec3 far  = (maxCorner - rayOrigin) * invDir;

	vec3 tmin = min(near, far);
	vec3 tmax = max(near, far);

	float t0 = max( max(tmin.x, tmin.y), tmin.z);
	float t1 = min( min(tmax.x, tmax.y), tmax.z);

	if (t0 > t1) return INFINITY;
	if (t0 > 0.0) // if we are outside the box
	{
		normal = -sign(rayDirection) * step(tmin.yzx, tmin) * step(tmin.zxy, tmin);
		isRayExiting = false;
		return t0;
	}
	if (t1 > 0.0) // if we are inside the box
	{
		normal = -sign(rayDirection) * step(tmax, tmax.yzx) * step(tmax, tmax.zxy);
		isRayExiting = true;
		return t1;
	}
	return INFINITY;
}
`;

THREE.ShaderChunk[ 'pathtracing_boundingbox_intersect' ] = `
//--------------------------------------------------------------------------------------
float BoundingBoxIntersect( vec3 minCorner, vec3 maxCorner, vec3 rayOrigin, vec3 invDir )
//--------------------------------------------------------------------------------------
{
	vec3 near = (minCorner - rayOrigin) * invDir;
	vec3 far  = (maxCorner - rayOrigin) * invDir;
	
	vec3 tmin = min(near, far);
	vec3 tmax = max(near, far);
	
	float t0 = max( max(tmin.x, tmin.y), tmin.z);
	float t1 = min( min(tmax.x, tmax.y), tmax.z);
	
	//return t1 >= max(t0, 0.0) ? t0 : INFINITY;
	return max(t0, 0.0) > t1 ? INFINITY : t0;
}
`;





THREE.ShaderChunk[ 'pathtracing_random_functions' ] = `
// globals used in rand() function
vec4 randVec4; // samples and holds the RGBA blueNoise texture value for this pixel
float randNumber; // the final randomly generated number (range: 0.0 to 1.0)
float counter; // will get incremented by 1 on each call to rand()
int channel; // the final selected color channel to use for rand() calc (range: 0 to 3, corresponds to R,G,B, or A)
float rand()
{
	counter++; // increment counter by 1 on every call to rand()
	// cycles through channels, if modulus is 1.0, channel will always be 0 (the R color channel)
	channel = int(mod(counter, 2.0)); 
	// but if modulus was 4.0, channel will cycle through all available channels: 0,1,2,3,0,1,2,3, and so on...
	randNumber = randVec4[channel]; // get value stored in channel 0:R, 1:G, 2:B, or 3:A
	return fract(randNumber); // we're only interested in randNumber's fractional value between 0.0 (inclusive) and 1.0 (non-inclusive)
	//return clamp(randNumber,0.0,0.999999999); // we're only interested in randNumber's fractional value between 0.0 (inclusive) and 1.0 (non-inclusive)
}
// from iq https://www.shadertoy.com/view/4tXyWN
// global seed used in rng() function
uvec2 seed;
float rng()
{
	seed += uvec2(1);
    	uvec2 q = 1103515245U * ( (seed >> 1U) ^ (seed.yx) );
    	uint  n = 1103515245U * ( (q.x) ^ (q.y >> 3U) );
	return float(n) * (1.0 / float(0xffffffffU));
}
vec3 randomSphereDirection()
{
    	float up = rng() * 2.0 - 1.0; // range: -1 to +1
	float over = sqrt( max(0.0, 1.0 - up * up) );
	float around = rng() * TWO_PI;
	return normalize(vec3(cos(around) * over, up, sin(around) * over));	
}
vec3 randomDirectionInHemisphere(vec3 nl)
{
	float r = rng();
	float phi = rng() * TWO_PI;
	float x = r * cos(phi);
	float y = r * sin(phi);
	float z = sqrt(1.0 - x*x - y*y);
	
	vec3 U = normalize( cross( abs(nl.y) < 0.9 ? vec3(0, 1, 0) : vec3(1, 0, 0), nl ) );
	vec3 V = cross(nl, U);
	return normalize(x * U + y * V + z * nl);
}
vec3 randomCosWeightedDirectionInHemisphere(vec3 nl)
{
	float r = sqrt(rng());
	float phi = rng() * TWO_PI;
	float x = r * cos(phi);
	float y = r * sin(phi);
	float z = sqrt(1.0 - x*x - y*y);
	vec3 U = normalize( cross( abs(nl.y) < 0.9 ? vec3(0, 1, 0) : vec3(1, 0, 0), nl ) );
	vec3 V = cross(nl, U);
	return normalize(x * U + y * V + z * nl);
}

// #define N_POINTS 32.0
// vec3 randomCosWeightedDirectionInHemisphere(vec3 nl)
// {
// 	float i = floor(N_POINTS * rng()) + (rng() * 0.5);
// 			// the Golden angle in radians
// 	float theta = i * 2.39996322972865332 + mod(uSampleCounter, TWO_PI);
// 	theta = mod(theta, TWO_PI);
// 	float r = sqrt(i / N_POINTS); // sqrt pushes points outward to prevent clumping in center of disk
// 	float x = r * cos(theta);
// 	float y = r * sin(theta);
// 	float z = sqrt(1.0 - x*x - y*y); // used for projecting XY disk points outward along Z axis
// 	// from "Building an Orthonormal Basis, Revisited" http://jcgt.org/published/0006/01/01/
// 	float signf = nl.z >= 0.0 ? 1.0 : -1.0;
// 	float a = -1.0 / (signf + nl.z);
// 	float b = nl.x * nl.y * a;
// 	vec3 T = vec3( 1.0 + signf * nl.x * nl.x * a, signf * b, -signf * nl.x );
// 	vec3 B = vec3( b, signf + nl.y * nl.y * a, -nl.y );
	
// 	return normalize(x * T + y * B + z * nl);
// }

vec3 randomDirectionInSpecularLobe(vec3 reflectionDir, float roughness)
{
	float r = sqrt(rng());
	float phi = rng() * TWO_PI;
	float x = r * cos(phi);
	float y = r * sin(phi);
	float z = sqrt(1.0 - x*x - y*y);
	
	vec3 U = normalize( cross( abs(reflectionDir.y) < 0.9 ? vec3(0, 1, 0) : vec3(1, 0, 0), reflectionDir ) );
	vec3 V = cross(reflectionDir, U);
	return normalize( mix(reflectionDir, x * U + y * V + z * reflectionDir, roughness * sqrt(roughness)) );
}

// //the following alternative skips the creation of tangent and bi-tangent vectors u and v 
// vec3 randomCosWeightedDirectionInHemisphere(vec3 nl)
// {
// 	float phi = rng() * TWO_PI;
// 	float theta = 2.0 * rng() - 1.0;
// 	return nl + vec3(sqrt(1.0 - theta * theta) * vec2(cos(phi), sin(phi)), theta);
// }
// vec3 randomDirectionInPhongSpecular(vec3 reflectionDir, float roughness)
// {
// 	float phi = rng() * TWO_PI;
// 	roughness = clamp(roughness, 0.0, 1.0);
// 	roughness = mix(13.0, 0.0, sqrt(roughness));
// 	float exponent = exp(roughness) + 1.0;
// 	//weight = (exponent + 2.0) / (exponent + 1.0);
// 	float cosTheta = pow(rng(), 1.0 / (exponent + 1.0));
// 	float radius = sqrt(max(0.0, 1.0 - cosTheta * cosTheta));
// 	vec3 u = normalize( cross( abs(reflectionDir.x) > 0.1 ? vec3(0, 1, 0) : vec3(1, 0, 0), reflectionDir ) );
// 	vec3 v = cross(reflectionDir, u);
// 	return normalize(u * cos(phi) * radius + v * sin(phi) * radius + reflectionDir * cosTheta);
// }
`;


THREE.ShaderChunk[ 'pathtracing_quad_intersect' ] = `
float TriangleIntersect( vec3 v0, vec3 v1, vec3 v2, vec3 rayOrigin, vec3 rayDirection, bool isDoubleSided )
{
	vec3 edge1 = v1 - v0;
	vec3 edge2 = v2 - v0;
	vec3 pvec = cross(rayDirection, edge2);
	float det = 1.0 / dot(edge1, pvec);
	if ( !isDoubleSided && det < 0.0 ) 
		return INFINITY;
	vec3 tvec = rayOrigin - v0;
	float u = dot(tvec, pvec) * det;
	vec3 qvec = cross(tvec, edge1);
	float v = dot(rayDirection, qvec) * det;
	float t = dot(edge2, qvec) * det;
	return (u < 0.0 || u > 1.0 || v < 0.0 || u + v > 1.0 || t <= 0.0) ? INFINITY : t;
}
//--------------------------------------------------------------------------------------------------------------
float QuadIntersect( vec3 v0, vec3 v1, vec3 v2, vec3 v3, vec3 rayOrigin, vec3 rayDirection, bool isDoubleSided )
//--------------------------------------------------------------------------------------------------------------
{
	return min(TriangleIntersect(v0, v1, v2, rayOrigin, rayDirection, isDoubleSided), 
		   TriangleIntersect(v0, v2, v3, rayOrigin, rayDirection, isDoubleSided));
}
`;


THREE.ShaderChunk[ 'pathtracing_sample_quad_light' ] = `
vec3 sampleQuadLight(vec3 x, vec3 nl, Quad light, out float weight)
{
	vec3 randPointOnLight;
	randPointOnLight.x = mix(light.v0.x, light.v2.x, clamp(rng(), 0.1, 0.9));
	randPointOnLight.y = light.v0.y;
	randPointOnLight.z = mix(light.v0.z, light.v2.z, clamp(rng(), 0.1, 0.9));
	vec3 dirToLight = randPointOnLight - x;
	float r2 = distance(light.v0, light.v1) * distance(light.v0, light.v3);
	float d2 = dot(dirToLight, dirToLight);
	float cos_a_max = sqrt(1.0 - clamp( r2 / d2, 0.0, 1.0));
	dirToLight = normalize(dirToLight);
	float dotNlRayDir = max(0.0, dot(nl, dirToLight)); 
	weight =  2.0 * (1.0 - cos_a_max) * max(0.0, -dot(dirToLight, light.normal)) * dotNlRayDir; 
	weight = clamp(weight, 0.0, 1.0);
	return dirToLight;
}
`;



THREE.ShaderChunk[ 'pathtracing_main' ] = `
// tentFilter from Peter Shirley's 'Realistic Ray Tracing (2nd Edition)' book, pg. 60
float tentFilter(float x)
{
	return (x < 0.5) ? sqrt(2.0 * x) - 1.0 : 1.0 - sqrt(2.0 - (2.0 * x));
}

void main( void )
{
	vec3 camRight   = vec3( uCameraMatrix[0][0],  uCameraMatrix[0][1],  uCameraMatrix[0][2]);
	vec3 camUp      = vec3( uCameraMatrix[1][0],  uCameraMatrix[1][1],  uCameraMatrix[1][2]);
	vec3 camForward = vec3(-uCameraMatrix[2][0], -uCameraMatrix[2][1], -uCameraMatrix[2][2]);
	// the following is not needed - three.js has a built-in uniform named cameraPosition
	vec3 camPos   = vec3( uCameraMatrix[3][0],  uCameraMatrix[3][1],  uCameraMatrix[3][2]);

	// calculate unique seed for rng() function
	seed = uvec2(uFrameCounter, uFrameCounter + 1.0) * uvec2(gl_FragCoord);
	// initialize rand() variables
	counter = -1.0; // will get incremented by 1 on each call to rand()
	channel = 0; // the final selected color channel to use for rand() calc (range: 0 to 3, corresponds to R,G,B, or A)
	randNumber = 0.0; // the final randomly-generated number (range: 0.0 to 1.0)
	randVec4 = vec4(0); // samples and holds the RGBA blueNoise texture value for this pixel
	randVec4 = texelFetch(tBlueNoiseTexture, ivec2(mod(gl_FragCoord.xy + floor(uRandomVec2 * 256.0), 256.0)), 0);

	// rand() produces higher FPS and almost immediate convergence, but may have very slight jagged diagonal edges on higher frequency color patterns, i.e. checkerboards.
	//vec2 pixelOffset = vec2( tentFilter(rand()), tentFilter(rand()) );
	// rng() has a little less FPS on mobile, and a little more noisy initially, but eventually converges on perfect anti-aliased edges - use this if 'beauty-render' is desired.
	vec2 pixelOffset = vec2( tentFilter(rng()), tentFilter(rng()) );

	// we must map pixelPos into the range -1.0 to +1.0
	vec2 pixelPos = ((gl_FragCoord.xy + pixelOffset) / uResolution) * 2.0 - 1.0;
	vec3 rayDir = normalize( pixelPos.x * camRight * uULen + pixelPos.y * camUp * uVLen + camForward );

	// depth of field
	vec3 focalPoint = uFocusDistance * rayDir;
	float randomAngle = rng() * TWO_PI; // pick random point on aperture
	float randomRadius = rng() * uApertureSize;
	vec3  randomAperturePos = ( cos(randomAngle) * camRight + sin(randomAngle) * camUp ) * sqrt(randomRadius);
	// point on aperture to focal point
	vec3 finalRayDir = normalize(focalPoint - randomAperturePos);

	rayOrigin = cameraPosition + randomAperturePos;
	rayDirection = finalRayDir;

	SetupScene();

	// Edge Detection - don't want to blur edges where either surface normals change abruptly (i.e. room wall corners), objects overlap each other (i.e. edge of a foreground sphere in front of another sphere right behind it),
	// or an abrupt color variation on the same smooth surface, even if it has similar surface normals (i.e. checkerboard pattern). Want to keep all of these cases as sharp as possible - no blur filter will be applied.
	vec3 objectNormal = vec3(0);
	vec3 objectColor = vec3(0);
	float objectID = -INFINITY;
	float pixelSharpness = 0.0;

	// perform path tracing and get resulting pixel color
	vec4 currentPixel = vec4( vec3(CalculateRadiance(objectNormal, objectColor, objectID, pixelSharpness)), 0.0 );
	
	// if difference between normals of neighboring pixels is less than the first edge0 threshold, the white edge line effect is considered off (0.0)
	float edge0 = 0.2; // edge0 is the minimum difference required between normals of neighboring pixels to start becoming a white edge line
	// any difference between normals of neighboring pixels that is between edge0 and edge1 smoothly ramps up the white edge line brightness (smoothstep 0.0-1.0)
	float edge1 = 0.6; // once the difference between normals of neighboring pixels is >= this edge1 threshold, the white edge line is considered fully bright (1.0)
	float difference_Nx = fwidth(objectNormal.x);
	float difference_Ny = fwidth(objectNormal.y);
	float difference_Nz = fwidth(objectNormal.z);
	float normalDifference = smoothstep(edge0, edge1, difference_Nx) + smoothstep(edge0, edge1, difference_Ny) + smoothstep(edge0, edge1, difference_Nz);
	edge0 = 0.0;
	edge1 = 0.5;
	float difference_obj = abs(dFdx(objectID)) > 0.0 ? 1.0 : 0.0;
	difference_obj += abs(dFdy(objectID)) > 0.0 ? 1.0 : 0.0;
	float objectDifference = smoothstep(edge0, edge1, difference_obj);
	float difference_col = length(dFdx(objectColor)) > 0.0 ? 1.0 : 0.0;
	difference_col += length(dFdy(objectColor)) > 0.0 ? 1.0 : 0.0;
	float colorDifference = smoothstep(edge0, edge1, difference_col);
	// edge detector (normal and object differences) white-line debug visualization
	//currentPixel.rgb += 1.0 * vec3(max(normalDifference, objectDifference));
	// edge detector (color difference) white-line debug visualization
	//currentPixel.rgb += 1.0 * vec3(colorDifference);

	vec4 previousPixel = texelFetch(tPreviousTexture, ivec2(gl_FragCoord.xy), 0);
	if (uFrameCounter == 1.0) // camera just moved after being still
	{
		previousPixel = vec4(0); // clear rendering accumulation buffer
	}
	else if (uCameraIsMoving) // camera is currently moving
	{
		previousPixel.rgb *= 0.5; // motion-blur trail amount (old image)
		currentPixel.rgb *= 0.5; // brightness of new image (noisy)

		previousPixel.a = 0.0;
	}

	currentPixel.a = 0.0;

	if (colorDifference >= 1.0 || normalDifference >= 1.0 || objectDifference >= 1.0)
		pixelSharpness = 1.01;


	// Eventually, all edge-containing pixels' .a (alpha channel) values will converge to 1.01, which keeps them from getting blurred by the box-blur filter, thus retaining sharpness.
	if (pixelSharpness == 1.01)
		currentPixel.a = 1.01;
	if (pixelSharpness == -1.0)
		currentPixel.a = -1.0;

	if (previousPixel.a == 1.01)
		currentPixel.a = 1.01;

	if (previousPixel.a == -1.0)
		currentPixel.a = 0.0;


	pc_fragColor = vec4(previousPixel.rgb + currentPixel.rgb, currentPixel.a);
}
`;
