#include <uniforms_and_defines>

/// color_picker uColors color

in vec2 vertex_uv;

#include <creation_scene>
#include <RayMarch>   
#include <rand>


vec3 flatPainting(in int hit_object){
    return uColors[hit_object];
}


#include <main_flatPainting>