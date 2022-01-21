#include <uniforms_and_defines>

/// color_picker scene uColors color
/// checkbox light uPreset preset 


in vec2 vertex_uv;

#include <creation_scene_1>
#include <RayMarch>
#include <get_normal>
#define GetNormal GetNormalEulerTwoSided
#include <rand>


vec3 Model_Illumination(in vec3 ray_position, in vec3 ray_origin,in int hit_object){
    return uColors[hit_object];
}



#include <main>