precision highp float;
precision highp int;
precision highp sampler2D;

uniform mat4 uBoxInvMatrix[4];
uniform mat4 uSphereInvMatrix[3];


#include <pathtracing_uniforms_and_defines>

#define N_QUADS 6
#define N_BOXES 4
#define N_SPHERES 3

vec3 rayOrigin, rayDirection;
// recorded intersection data:
vec3 hitNormal, hitEmission, hitColor;
vec2 hitUV;
float hitObjectID;
int hitType;

struct Sphere { float radius; vec3 position; vec3 emission; vec3 color; float roughness; int type; };
struct Quad { vec3 normal; vec3 v0; vec3 v1; vec3 v2; vec3 v3; vec3 emission; vec3 color; int type; };
struct Box { vec3 minCorner; vec3 maxCorner; vec3 emission; vec3 color; int type; };

Quad quads[N_QUADS];
Box boxes[N_BOXES];
Sphere spheres[N_SPHERES];


#include <pathtracing_random_functions>

#include <pathtracing_sphere_intersect>

#include <pathtracing_quad_intersect>

#include <pathtracing_box_intersect>

#include <pathtracing_sample_quad_light>


//---------------------------------------------------------------------------------------
float SceneIntersect( )
//---------------------------------------------------------------------------------------
{
	vec3 rObjOrigin, rObjDirection; 
	vec3 normal;
        float d;
	float t = INFINITY;
	bool isRayExiting = false;
	int objectCount = 0;
	
	hitObjectID = -INFINITY;
	
		
	for (int i = 0; i < N_QUADS; i++)
        {
		d = QuadIntersect( quads[i].v0, quads[i].v1, quads[i].v2, quads[i].v3, rayOrigin, rayDirection, false );
		if (d < t)
		{
			t = d;
			hitNormal = normalize(quads[i].normal);
			hitEmission = quads[i].emission;
			hitColor = quads[i].color;
			hitType = quads[i].type;
			hitObjectID = float(objectCount);
		}
		objectCount++;
        }
	
	
	// TALL MIRROR BOX
	// transform ray into Tall Box's object space
    for(int i =0; i<N_BOXES; i++){
        rObjOrigin = vec3( uBoxInvMatrix[i] * vec4(rayOrigin, 1.0) );
        rObjDirection = vec3( uBoxInvMatrix[i] * vec4(rayDirection, 0.0) );
        d = BoxIntersect( boxes[i].minCorner, boxes[i].maxCorner, rObjOrigin, rObjDirection, normal, isRayExiting );
        
        if (d < t)
        {	
            t = d;
            
            // transfom normal back into world space
            normal = normalize(normal);
            hitNormal = normalize(transpose(mat3(uBoxInvMatrix[i])) * normal);
            hitEmission = boxes[i].emission;
            hitColor = boxes[i].color;
            hitType = boxes[i].type;
            hitObjectID = float(objectCount);
        }
        objectCount++;
    }
	
    for(int i =0; i<N_SPHERES; i++){
		d = SphereIntersect( spheres[i].radius, spheres[i].position, rayOrigin, rayDirection );
        
        if (d < t)
        {	
            t = d;
            
            // transfom normal back into world space
            normal = normalize(normal);
            hitNormal = normalize(transpose(mat3(uBoxInvMatrix[i])) * normal);
            hitEmission = spheres[i].emission;
            hitColor = spheres[i].color;
            hitType = spheres[i].type;
            hitObjectID = float(objectCount);
        }
        objectCount++;
    }
	
	// // SHORT DIFFUSE WHITE BOX
	// // transform ray into Short Box's object space
	// rObjOrigin = vec3( uShortBoxInvMatrix * vec4(rayOrigin, 1.0) );
	// rObjDirection = vec3( uShortBoxInvMatrix * vec4(rayDirection, 0.0) );
	// d = BoxIntersect( boxes[1].minCorner, boxes[1].maxCorner, rObjOrigin, rObjDirection, normal, isRayExiting );
	
	// if (d < t)
	// {	
	// 	t = d;
		
	// 	// transfom normal back into world space
	// 	normal = normalize(normal);
	// 	hitNormal = normalize(transpose(mat3(uShortBoxInvMatrix)) * normal);
	// 	hitEmission = boxes[1].emission;
	// 	hitColor = boxes[1].color;
	// 	hitType = boxes[1].type;
	// 	hitObjectID = float(objectCount);
	// }

	
	// // NEW BOX TEST
	// // transform ray into Short Box's object space
	// rObjOrigin = vec3( uNewBoxInvMatrix * vec4(rayOrigin, 1.0) );
	// rObjDirection = vec3( uNewBoxInvMatrix * vec4(rayDirection, 0.0) );
	// d = BoxIntersect( boxes[2].minCorner, boxes[1].maxCorner, rObjOrigin, rObjDirection, normal, isRayExiting );
	
	// if (d < t)
	// {	
	// 	t = d;
		
	// 	// transfom normal back into world space
	// 	normal = normalize(normal);
	// 	hitNormal = normalize(transpose(mat3(uNewBoxInvMatrix)) * normal);
	// 	hitEmission = boxes[1].emission;
	// 	hitColor = boxes[1].color;
	// 	hitType = boxes[1].type;
	// 	hitObjectID = float(objectCount);
	// }

	return t;
} // end float SceneIntersect( )


//-----------------------------------------------------------------------------------------------------------------------------
vec3 CalculateRadiance( out vec3 objectNormal, out vec3 objectColor, out float objectID, out float pixelSharpness )
//-----------------------------------------------------------------------------------------------------------------------------
{
        Quad light = quads[5];

	vec3 accumCol = vec3(0);
        vec3 mask = vec3(1);
        vec3 n, nl, x;
	vec3 dirToLight;
        
	float t = INFINITY;
	float weight, p;
	
	int diffuseCount = 0;
	int previousIntersecType = -100;
	hitType = -100;
	
	bool bounceIsSpecular = true;
	bool sampleLight = false;
	bool createCausticRay = false;


	for (int bounces = 0; bounces < 5; bounces++)
	{
		previousIntersecType = hitType;

		t = SceneIntersect();

		if (t == INFINITY)
			break;

		// useful data 
		n = normalize(hitNormal);
                nl = dot(n, rayDirection) < 0.0 ? normalize(n) : normalize(-n);
		x = rayOrigin + rayDirection * t;

		if (bounces == 0)
		{
			objectNormal = nl;
			objectColor = hitColor;
			objectID = hitObjectID;
		}
		if (bounces == 1 && previousIntersecType == SPEC)
		{
			objectNormal = nl;
		}
		
		
		if (hitType == LIGHT)
		{	
			if (diffuseCount == 0)
				pixelSharpness = 1.01;

			if (bounceIsSpecular || sampleLight || createCausticRay)
				accumCol = mask * hitEmission;

			// reached a light source, so we can exit
			break;
		}
		
		// if we get here and sampleLight is still true, shadow ray failed to find a light source
		if (sampleLight) 
			break;



                if (hitType == DIFF) // Ideal DIFFUSE reflection
                {
			if (createCausticRay)
				break;

			if ( diffuseCount == 0 && previousIntersecType == SPEC )	
				objectColor = hitColor;

			diffuseCount++;

			mask *= hitColor;

			// create caustic ray
                        if (diffuseCount == 1 && rand() < 0.25)// && uSampleCounter > 20.0)
                        {
				createCausticRay = true;

				vec3 randVec = vec3(rng() * 2.0 - 1.0, rng() * 2.0 - 1.0, rng() * 2.0 - 1.0);
				vec3 offset = vec3(randVec.x * 82.0, randVec.y * 170.0, randVec.z * 80.0);
				vec3 target = vec3(180.0 + offset.x, 170.0 + offset.y, -350.0 + offset.z);
				
				rayDirection = normalize(target - x);
				rayOrigin = x + nl * uEPS_intersect;
				
				weight = max(0.0, dot(nl, rayDirection));
				mask *= weight;

				continue;
			}

			bounceIsSpecular = false;

			if (diffuseCount == 1 && rand() < 0.5)
			{	
				// choose random Diffuse sample vector
				rayDirection = randomCosWeightedDirectionInHemisphere(nl);
				rayOrigin = x + nl * uEPS_intersect;
				continue;
			}
			
			dirToLight = sampleQuadLight(x, nl, light, weight);
			mask *= weight;

			rayDirection = dirToLight;
			rayOrigin = x + nl * uEPS_intersect;
			sampleLight = true;
			continue;
                        
                } // end if (hitType == DIFF)
		
                if (hitType == SPEC)  // Ideal SPECULAR reflection
		{
			mask *= hitColor;

			rayDirection = reflect(rayDirection, nl);
			rayOrigin = x + nl * uEPS_intersect;

			continue;
		}
		
	} // end for (int bounces = 0; bounces < 5; bounces++)
	
	return max(vec3(0), accumCol);

}  // end vec3 CalculateRadiance( out vec3 objectNormal, out vec3 objectColor, out float objectID, out float pixelSharpness )


//-----------------------------------------------------------------------
void SetupScene(void)
//-----------------------------------------------------------------------
{
	vec3 z  = vec3(0);// No color value, Black        
	vec3 L1 = vec3(1.0, 0.7, 0.38) * 30.0;// Bright Yellowish light
	
	quads[0] = Quad( vec3( 0.0, 0.0, 1.0), vec3(  0.0,   0.0,-559.2), vec3(549.6,   0.0,-559.2), vec3(549.6, 548.8,-559.2), vec3(  0.0, 548.8,-559.2),  z, vec3(1),  DIFF);// Back Wall
	quads[1] = Quad( vec3( 1.0, 0.0, 0.0), vec3(  0.0,   0.0,   0.0), vec3(  0.0,   0.0,-559.2), vec3(  0.0, 548.8,-559.2), vec3(  0.0, 548.8,   0.0),  z, vec3(0.7, 0.12,0.05),  DIFF);// Left Wall Red
	quads[2] = Quad( vec3(-1.0, 0.0, 0.0), vec3(549.6,   0.0,-559.2), vec3(549.6,   0.0,   0.0), vec3(549.6, 548.8,   0.0), vec3(549.6, 548.8,-559.2),  z, vec3(0.2, 0.4, 0.36),  DIFF);// Right Wall Green
	quads[3] = Quad( vec3( 0.0,-1.0, 0.0), vec3(  0.0, 548.8,-559.2), vec3(549.6, 548.8,-559.2), vec3(549.6, 548.8,   0.0), vec3(  0.0, 548.8,   0.0),  z, vec3(1),  DIFF);// Ceiling
	quads[4] = Quad( vec3( 0.0, 1.0, 0.0), vec3(  0.0,   0.0,   0.0), vec3(549.6,   0.0,   0.0), vec3(549.6,   0.0,-559.2), vec3(  0.0,   0.0,-559.2),  z, vec3(1),  DIFF);// Floor
	quads[5] = Quad( vec3( 0.0,-1.0, 0.0), vec3(213.0, 548.0,-332.0), vec3(343.0, 548.0,-332.0), vec3(343.0, 548.0,-227.0), vec3(213.0, 548.0,-227.0), L1,       z, LIGHT);// Area Light Rectangle in ceiling
	
	boxes[0]  = Box( vec3(-82.0,-170.0, -80.0), vec3(82.0,170.0, 80.0), z, vec3(1), SPEC);// Tall Mirror Box Left
	boxes[1]  = Box( vec3(-86.0, -85.0, -80.0), vec3(0, 85.0, 80.0), z, vec3(1), DIFF);// Short Diffuse Box Right
	boxes[2]  = Box( vec3(-86.0, -85.0, -80.0), vec3(0, 85.0, 80.0), z, vec3(1), DIFF);// Short Diffuse Box Right
	boxes[3]  = Box( vec3(-86.0, -85.0, -80.0), vec3(0, 85.0, 80.0), z, vec3(1), SPEC);// Short Diffuse Box Right

    spheres[0] = Sphere(50.0, vec3( 400, 300, -200), z, vec3(0.8, 0.7, 0.4), 0.0, DIFF);// White Ball
	spheres[1] = Sphere(50.0, vec3(80, 400, -350),   z, vec3(0.9, 0.4, 0.0), 0.0, DIFF);// Yellow Ball
	spheres[2] = Sphere(50.0, vec3( 500, 170+20, -300), z, vec3(0.25, 0.0, 0.0), 0.0, DIFF);// Red Ball
       
}


#include <pathtracing_main>
