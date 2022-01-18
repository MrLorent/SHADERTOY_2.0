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

#include <main_lambert>