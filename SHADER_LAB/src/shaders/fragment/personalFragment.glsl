#include <uniforms_and_defines>

in vec2 vertex_uv;



#include <creation_scene>
#include <RayMarch>   
#include <rand>

// To create an uniform value and to get a slider linked to it : 
// /// uName name min max step

vec3 flatPainting(in int hit_object){
    return uColors[hit_object];
}


#include <main_flatPainting>