#include <uniforms_and_defines>

/// color_picker uColors color

in vec2 vertex_uv;

#include <creation_scene>
#include <RayMarch>   
#include <rand>


vec3 flatPainting(in int hit_object){
    return uColors[hit_object];
}


void main()
{
    vec2 uv = vertex_uv-0.5;
    uv*=uResolution.xy/uResolution.y;
    vec3 color=vec3(0);
    
    for(int i=0; i<N_RAY; i++){
        // simplest camera
        vec3 ray_origin = uCameraPosition;

        // Casting a ray in a random place for each pixels
        float offset = rand(vec2(i))/uResolution.y;
        vec3 ray_direction = normalize(vec3(uv.xy+offset, 1));


        // RayMarching stuff
        int hit_object;
        float distance_to_object = RayMarch(hit_object, ray_origin, ray_direction);

        color += flatPainting(hit_object);
    }

   
    pc_fragColor = clamp(vec4( pow(color/float(N_RAY), vec3(0.4545)), 1.0 ), 0.0, 1.0);//vec4(color/10.0, 1.0);

}