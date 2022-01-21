#include <uniforms_and_defines>

/// color_picker scene uColors color

in vec2 vertex_uv;

#include <creation_object>
#include <creation_scene_0>
#include <RayMarch>
#include <get_normal>
#define GetNormal GetNormalEulerTwoSided
#include <rand>


void init_object(){
    plane.mat.base_color=uColors[0];
    if(SCENE == 0){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;
        sphere1.mat.base_color=uColors[2];

        box1.origin=vec3(1,1,5);
        box1.dimension=vec3(0.5);
        box1.mat.base_color=uColors[1];

    }else if(SCENE == 1){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;
        sphere1.mat.base_color=uColors[1];

        sphere2.origin=vec3(0,1,5);
        sphere2.radius=0.5;
        sphere2.mat.base_color=uColors[2];

        sphere3.origin=vec3(1,1,5);
        sphere3.radius=0.5;
        sphere3.mat.base_color=uColors[3];
    }
}

vec3 Model_Illumination(in vec3 ray_position, in vec3 ray_origin,in Material hit_object){
    return hit_object.base_color;
}


#include <main>