#include <uniforms_and_defines>



/// slider scene uKs specular 0 1 0.01
/// slider scene uKd diffus 0 1 0.01
/// slider scene uShininess shininess 0 100 1
/// color_picker scene uColors color
/// checkbox light uRotatingLight rotate_light
/// color_picker light uColorLight color_light
/// slider light uLightPositionX positionX_light -50 50 0.1
/// slider light uLightPositionY positionY_light -50 50 0.1
/// slider light uLightPositionZ positionZ_light -50 50 0.1

/// color_picker light uColorLight2 color_light2
/// slider light uLightPositionX2 positionX_light2 -50 50 0.1
/// slider light uLightPositionY2 positionY_light2 -50 50 0.1
/// slider light uLightPositionZ2 positionZ_light2 -50 50 0.1

/// checkbox light uSecond_Light_on_off preset 




#include <creation_object>
#include <scene_preset_0>
#include <RayMarch>
#include <get_normal>
#define GetNormal GetNormalEulerTwoSided
#include <rand>
#include <init_object_phong>



vec3 Model_Illumination(in vec3 ray_position, in vec3 ray_origin, in Material hit_object) {
    //Turning light
    vec3 lightPosOffset = uRotatingLight*vec3(sin(2. * uTime), 0, cos(2. * uTime)) * 3.; //light is turning
    vec3 lightPos =  vec3(uLightPositionX,uLightPositionY,uLightPositionZ)+ lightPosOffset;
    vec3 lightPos2 =  vec3(uLightPositionX2,uLightPositionY2,uLightPositionZ2)+ lightPosOffset;

    // some Maths stuff
    vec3 light_vector = normalize(lightPos - ray_position);
    vec3 light_vector2 = normalize(lightPos2 - ray_position);


    vec3 normal = GetNormal(ray_position);


    vec3 ray_vector = normalize(ray_origin - ray_position);
    
    vec3 half_vector = normalize(light_vector + ray_vector); // the `half-angle` vector
    vec3 half_vector2 = normalize(light_vector2 + ray_vector); // the `half-angle` vector
    

    float diffuse  = clamp(dot(light_vector, normal), 0., 1.);
    float diffuse2  = clamp(dot(light_vector2, normal), 0., 1.);


    float specular = clamp(dot(half_vector, normal), 0., 1.);  // also called `blinn term`
    float specular2 = clamp(dot(half_vector2, normal), 0., 1.);  // also called `blinn term`
    

    // shadow stuff
    vec3 position_offset = normal * SURF_DIST_MARCH * 1.2; // move the point above a little
    Material _; //useless stuff but needed for the next RayMarch
    float d = RayMarch(_, ray_position + position_offset, light_vector);
    float d2 = RayMarch(_, ray_position + position_offset, light_vector2);


    if (d < length(lightPos - ray_position)|| uSecond_Light_on_off*d2 < uSecond_Light_on_off*length(lightPos2 - ray_position)) { // If true then we've shaded a point on some object before, 
                                    // so shade the currnet point as shodow.
        diffuse *= .3; // no half-shadow because the light source is a point.  
        diffuse2 *= .3;  
        specular = 0.; // shadows don't have specular component, I think.
        specular2 = 0.;
    }


    // Blinn-Phong stuff
    vec3 ambientDiffuse = uColorLight * hit_object.base_color;
    vec3 ambientDiffuse2 = uColorLight2 * hit_object.base_color;


    float light1DiffuseComponent = diffuse ;//* uColorLight;
    float light1DiffuseComponent2 = diffuse2 ; //* uColorLight2;

    float light1SpecularComponent = pow(specular, hit_object.shininess);
    float light1SpecularComponent2 = pow(specular2, hit_object.shininess);

    float diffusComponent1=hit_object.kd * light1DiffuseComponent;
    float specularComponent1= hit_object.ks* light1SpecularComponent;
    vec3 col1=(diffusComponent1 + specularComponent1)* ambientDiffuse;

    float diffusComponent2=hit_object.kd * light1DiffuseComponent2;
    float specularComponent2= hit_object.ks* light1SpecularComponent2;
    vec3 col2=(diffusComponent2 + specularComponent2)* ambientDiffuse2;
    
    vec3 col = col1 + uSecond_Light_on_off *col2;
    return col;
}

#include <main>