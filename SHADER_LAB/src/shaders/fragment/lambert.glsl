#include <uniforms_and_defines>


/// color_picker scene uColors color
/// checkbox light uRotatingLight rotate_light 
/// checkbox light uSecond_Light_on_off preset 
/// checkbox light uShadow shadow

/// color_picker light uColorLight color_light
/// slider light uLightPositionX positionX_light -2. 2. 0.1
/// slider light uLightPositionY positionY_light 1 4. 0.1
/// slider light uLightPositionZ positionZ_light 1 5 0.1

/// color_picker light uColorLight2 color_light2
/// slider light uLightPositionX2 positionX_light2 -2. 2. 0.1
/// slider light uLightPositionY2 positionY_light2 1 4. 0.1
/// slider light uLightPositionZ2 positionZ_light2 1 5 0.1



#include <creation_object>
#include <dot2>
#include <scene_preset_0>
#include <RayMarch>
#include <get_normal>
#include <rand>
#include <init_object_lambert>

vec3 Model_Illumination(in vec3 ray_intersect,in vec3 ray_origin ,in Material hit_object){
    vec3 lightPosOffset = uRotatingLight*vec3(sin(2. * uTime), 0, cos(2. * uTime))*0.5;// * 3.;
    vec3 lightPos = vec3(uLightPositionX,uLightPositionY,uLightPositionZ) + lightPosOffset;
    vec3 lightPos2 = vec3(uLightPositionX2,uLightPositionY2,uLightPositionZ2) + lightPosOffset;


    vec3 light_vector = normalize(lightPos - ray_intersect); 
    vec3 light_vector2 = normalize(lightPos2 - ray_intersect); 

    vec3 normal = get_normal(ray_intersect); 
    float diffuse  = clamp(dot(light_vector, normal), 0., 1.);
    float diffuse2  = clamp(dot(light_vector2, normal), 0., 1.);

    // shadow stuff
    vec3 position_offset = normal * SURF_DIST_MARCH * 1.2; // move the point above a little
    Material _; //useless stuff but needed for the next RayMarch
    float d = RayMarch(_, ray_intersect + position_offset, light_vector);
    float d2 = RayMarch(_, ray_intersect + position_offset, light_vector2);
    if (uShadow==1. &&  (d < length(lightPos - ray_intersect) || uSecond_Light_on_off*d2 < uSecond_Light_on_off*length(lightPos - ray_intersect))) { // If true then we've shaded a point on some object before, 
    // If true then we've shaded a point on some object before, 
                                    // so shade the currnet point as shodow.
        diffuse *= .3 ;
        diffuse2 *= .3 ;

        // no half-shadow because the light source is a point.  
                                 
      
    }
    


    
    return (diffuse  * hit_object.base_color * uColorLight) +uSecond_Light_on_off*(diffuse2  * hit_object.base_color * uColorLight2); 
}

#include <main>