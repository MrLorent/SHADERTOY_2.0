#include <uniforms_and_defines>
#include <creation_object>
#include <dot2>
#include <scene_preset_0>
#include <RayMarch>   
#include <rand>
#include <init_object_personal>



// To create an uniform value and to get a slider linked to it : 
// /// color_picker light||scene uName name
// /// checkbox light||scene uName name
// /// slider light||scene uName name min max step

/// color_picker light uColorLight2 color_light2
/// slider light uLightPositionX2 positionX_light2 -50 50 0.1
/// slider light uLightPositionY2 positionY_light2 -50 50 0.1
/// slider light uLightPositionZ2 positionZ_light2 -50 50 0.1

/// checkbox light uSecond_Light_on_off preset 

// To create an uniform value and to get a slider linked to it : 
// /// color_picker scene uName name
// /// slider scene uName name min max step

vec3 Model_Illumination(in vec3 ray_intersect, in vec3 ray_origin, in Material hit_object) {

    return vec3(1.);
}

#include <main>