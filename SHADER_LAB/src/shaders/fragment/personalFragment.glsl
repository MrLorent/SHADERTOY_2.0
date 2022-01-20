#include <uniforms_and_defines>


in vec2 vertex_uv;



#include <creation_scene>
#include <RayMarch>   
#include <rand>

// To create an uniform value and to get a slider linked to it : 
// /// color_picker light||scene uName name
// /// checkbox light||scene uName name
// /// slider light||scene uName name min max step

vec3 Model_Illumination(in vec3 ray_position, in vec3 ray_origin, in int hit_object) {

    return vec3(1.);
}

#include <main>