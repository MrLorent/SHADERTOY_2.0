#include <uniforms_and_defines>

/// color_picker scene uColors color
/// checkbox light uSecond_Light_on_off preset 


#include <creation_object>
#include <scene_preset_0>
#include <RayMarch>
#include <get_normal>
#define GetNormal GetNormalEulerTwoSided
#include <rand>

#include <init_object_flat_painting>

vec3 Model_Illumination(in vec3 ray_position, in vec3 ray_origin,in Material hit_object){
    return hit_object.base_color;
}


#include <main>