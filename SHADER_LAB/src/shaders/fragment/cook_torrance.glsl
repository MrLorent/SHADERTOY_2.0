#include <uniforms_and_defines>



/// slider scene uKs specular 0 1 0.01
/// slider scene uRoughness roughness 0 1 0.01
/// color_picker scene uColors color

/// checkbox light uRotatingLight rotate_light
/// color_picker light uColorLight color_light
/// slider light uLightPositionX positionX_light -50 50 0.1
/// slider light uLightPositionY positionY_light -50 50 0.1
/// slider light uLightPositionZ positionZ_light -50 50 0.1





in vec2 vertex_uv;


#include <creation_object>
#include <creation_scene_0>
#include <RayMarch>
#include <get_normal>
#define GetNormal GetNormalEulerTwoSided
#include <rand>
#include <fresnel>
#include <beckmann_distribution>
#include <geometry_function>
#include <init_object_cook_torrance>




vec3 Model_Illumination( in vec3 p, in vec3 ro, in Material hit_object )
{
    //Turning lights
    vec3 lightPosOffset = vec3(sin(2. * uTime), 0, cos(2. * uTime)) * 3.;
    vec3 lightPos =  vec3(uLightPositionX,uLightPositionY,uLightPositionZ)+ lightPosOffset;
    //vec3 lightPos2 =  vec3(uLightPositionX2,uLightPositionY2,uLightPositionZ2)+ lightPosOffset;

	
    //some math stuff
    vec3  l  = normalize( lightPos - p);
    vec3  v  = normalize(ro - p);
    vec3  n  = GetNormal(p);
    float nl = max ( 0.0, dot(n, l));
    vec3  h  = normalize(l + v);
    float hn = max ( 0.0, dot(h, n));
    float nv   = dot (n, v);
	float vh   = dot (v, h);
	
	// compute Beckman
   	float d = D_beckmann(hit_object.roughness, hn);

    // compute Fresnel
    vec3 f = fresnel(ro, nv);
	
    // default G
    float g = G_default(nl, hn, nv, vh);
	
	// resulting color
	vec3  ct   = f*(0.25 * d * g / nv);
	float diff = max(nl, 0.0);

	return vec3 ( diff * hit_object.base_color + hit_object.ks * ct)* uColorLight;
}


#include <main>










