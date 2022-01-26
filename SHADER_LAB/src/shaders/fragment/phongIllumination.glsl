#include <uniforms_and_defines>



/// slider scene uKs specular 0.1 1 0.1
/// slider scene uKd diffus 0.1 1 0.1
/// slider scene uShininess shininess 0.1 100 1
/// color_picker scene uColors color
/// checkbox light uRotatingLight rotate_light

/// color_picker light uColorLight color_light
/// slider light uLightPositionX positionX_light -2 2 0.1
/// slider light uLightPositionY positionY_light 1 4 0.1
/// slider light uLightPositionZ positionZ_light 1 5 0.1

/// color_picker light uColorLight2 color_light2
/// slider light uLightPositionX2 positionX_light2 -2 2 0.1
/// slider light uLightPositionY2 positionY_light2 1 4 0.1
/// slider light uLightPositionZ2 positionZ_light2 1 5 0.1

/// checkbox light uSecond_Light_on_off preset 




#include <creation_object>
#include <dot2>
#include <scene_preset_0>
#include <RayMarch>
#include <get_normal>
#include <rand>
#include <init_object_phong>



vec3 Model_Illumination(in vec3 ray_intersect, in vec3 ray_origin, in Material hit_object) {
    //Turning light
    vec3 lightPosOffset = uRotatingLight*vec3(sin(2. * uTime), 0, cos(2. * uTime))*0.5;// * 3.; //light is turning
    vec3 lightPos =  vec3(uLightPositionX,uLightPositionY,uLightPositionZ)+ lightPosOffset;
    vec3 lightPos2 =  vec3(uLightPositionX2,uLightPositionY2,uLightPositionZ2)+ lightPosOffset;

    // some Maths stuff
    vec3 light_vector = normalize(lightPos - ray_intersect);
    vec3 light_vector2 = normalize(lightPos2 - ray_intersect);

    vec3 normal = get_normal(ray_intersect);

    vec3 ray_vector = normalize(ray_origin - ray_intersect);
    
    vec3 half_vector = normalize(light_vector + ray_vector); // the `half-angle` vector
    vec3 half_vector2 = normalize(light_vector2 + ray_vector); // the `half-angle` vector
    

    float diffuse  = clamp(dot(light_vector, normal), 0., 1.);
    float diffuse2  = clamp(dot(light_vector2, normal), 0., 1.);


    float specular = clamp(dot(half_vector, normal), 0., 1.);  // also called `blinn term`
    float specular2 = clamp(dot(half_vector2, normal), 0., 1.);  // also called `blinn term`
    

    // shadow stuff
    vec3 position_offset = normal * SURF_DIST_MARCH * 1.2; // move the point above a little
    Material _; //useless stuff but needed for the next RayMarch
    float d = RayMarch(_, ray_intersect + position_offset, light_vector);
    float d2 = RayMarch(_, ray_intersect + position_offset, light_vector2);


    if (d < length(lightPos - ray_intersect)|| uSecond_Light_on_off*d2 < uSecond_Light_on_off*length(lightPos2 - ray_intersect)) { // If true then we've shaded a point on some object before, 
                                    // so shade the currnet point as shodow.
        diffuse *= .3; // no half-shadow because the light source is a point.  
        diffuse2 *= .3;  
        specular = 0.; // shadows don't have specular component, I think.
        specular2 = 0.;
    }


    // Blinn-Phong stuff
    vec3 col1 = uColorLight * hit_object.base_color;
    col1 = col1 * hit_object.kd * diffuse + hit_object.ks * pow(specular, hit_object.shininess);

    vec3 col2 = uColorLight2 * hit_object.base_color;
    col2 = col2 * hit_object.kd * diffuse2 + hit_object.ks * pow(specular2, hit_object.shininess);
    
    vec3 col = col1 + uSecond_Light_on_off *col2;
    return pow(col,vec3(0.8)); //Gama correction
}

#include <main>