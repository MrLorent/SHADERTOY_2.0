#include <uniforms_and_defines>


/// color_picker scene uColors color
/// checkbox light uRotatingLight rotate_light 
/// color_picker light uColorLight color_light
/// slider light uLightPositionX positionX_light -50 50 0.1
/// slider light uLightPositionY positionY_light -50 50 0.1
/// slider light uLightPositionZ positionZ_light -50 50 0.1

in vec2 vertex_uv;

#include <creation_scene_0>
#include <RayMarch>
#include <get_normal>
#define GetNormal GetNormalEulerTwoSided
#include <rand>


vec3 Model_Illumination(in vec3 ray_position,in vec3 ray_origin ,in int hit_object){
    vec3 lightPosOffset = uRotatingLight*vec3(sin(2. * uTime), 0, cos(2. * uTime)) * 3.;
    vec3 lightPos = vec3(uLightPositionX,uLightPositionY,uLightPositionZ) + lightPosOffset;
    
    vec3 light_vector = normalize(lightPos - ray_position); 
    vec3 normal = GetNormal(ray_position); 
    float diffuse  = clamp(dot(light_vector, normal), 0., 1.);

    // shadow stuff
    vec3 position_offset = normal * SURF_DIST_MARCH * 1.2; // move the point above a little
    int _; //useless stuff but needed for the next RayMarch
    float d = RayMarch(_, ray_position + position_offset, light_vector);
    if (d < length(lightPos - ray_position)) { // If true then we've shaded a point on some object before, 
                                    // so shade the currnet point as shodow.
        diffuse *= .3; // no half-shadow because the light source is a point.    
    }
    
    return diffuse * uColors[hit_object] * uColorLight;
}

#include <main>