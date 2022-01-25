#include <uniforms_and_defines>
#include <creation_object>
#include <scene_preset_0>
#include <RayMarch>   
#include <rand>



// To create an uniform value and to get a slider linked to it : 
// /// color_picker light||scene uName name
// /// checkbox light||scene uName name
// /// slider light||scene uName name min max step

void init_object(){
    if(SCENE == 0){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;

        box1.origin=vec3(1,1,5);
        box1.dimension=vec3(0.5);

    }else if(SCENE == 1){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;

        sphere2.origin=vec3(0,1,5);
        sphere2.radius=0.5;

        sphere3.origin=vec3(1,1,5);
        sphere3.radius=0.5;
    }
}

vec3 Model_Illumination(in vec3 ray_position, in vec3 ray_origin, in Material hit_object) {

    return vec3(1.);
}

#include <main>