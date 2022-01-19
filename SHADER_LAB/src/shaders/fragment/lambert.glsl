#include <uniforms_and_defines>

/// color_picker uColors color
/// checkbox uRotatingLight rotate_light 

in vec2 vertex_uv;

#include <creation_scene>
#include <RayMarch>
#include <get_normal>
#define GetNormal GetNormalEulerTwoSided
#include <rand>


vec3 Lambert(in vec3 ray_position, in int hit_object){
    vec3 lightPosOffset = uRotatingLight*vec3(sin(2. * uTime), 0, cos(2. * uTime)) * 3.;
    vec3 lightPos = light.pos + lightPosOffset;
    
    vec3 light_vector = normalize(lightPos - ray_position); 
    vec3 normal = GetNormal(ray_position); 
    float diffuse  = clamp(dot(light_vector, normal), 0., 1.);

    // shadow stuff
    vec3 position_offset = normal * SURF_DIST_MARCH * 1.2; // move the point above a little
    int _; //useless stuff but needed for the next RayMarch
    float d = RayMarch(_, ray_position + position_offset, light_vector);
    if (d < length(lightPos - ray_position)) { // If true then we've shaded a point on some object before, 
                                    // so shade the currnet point as shodow.
        diffuse *= .3; // no half-shadow because the light source is a point.    
    }
    
    return diffuse * uColors[hit_object] * light.col;
}

void main()
{
    //sphere.origin=vec3((mat4(uSphereInvMatrix[0])* vec4(-1,1, 8, 1)).xyz);
    //box.origin=vec3((mat4(uBoxInvMatrix[0])* vec4(1,1, 8, 1)).xyz);
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
        vec3 ray_position = ray_origin + ray_direction * distance_to_object;

        color+=Lambert(ray_position, hit_object);
    }

   
	pc_fragColor = clamp(vec4( pow(color/float(N_RAY), vec3(0.4545)), 1.0 ), 0.0, 1.0);//vec4(color/10.0, 1.0);

}