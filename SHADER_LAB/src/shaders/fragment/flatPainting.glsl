#include <uniforms_and_defines>

/// checkbox light uSecond_Light_on_off preset 
/// color_picker scene uColors color


#include <creation_object>
#include <dot2>
#include <scene_preset_0>
#include <RayMarch>
#include <get_normal>
#include <rand>
#include <init_object_flat_painting>

vec3 Model_Illumination(in vec3 ray_intersect, in vec3 ray_origin,in Material hit_object){
    return hit_object.base_color;
}


#include <main>