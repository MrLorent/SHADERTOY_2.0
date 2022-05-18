#include <uniforms_and_defines>

/// color_picker scene uColors colors
/// slider scene uRoughness roughness 0 1 0.01

/// checkbox light uRotatingLight rotate_light

/// checkbox light uSecond_Light_on_off preset
/// checkbox light uShadow shadow

/// color_picker light uColorLight color_light
/// slider light uLightPositionX positionX_light -2 2 0.1
/// slider light uLightPositionY positionY_light 1 4 0.1
/// slider light uLightPositionZ positionZ_light 1 5 0.1

/// color_picker light uColorLight2 color_light2
/// slider light uLightPositionX2 positionX_light2 -2 2 0.1
/// slider light uLightPositionY2 positionY_light2 1 4 0.1
/// slider light uLightPositionZ2 positionZ_light2 1 5 0.1

#include <creation_object>
#include <dot2>
#include <scene_preset_0>
#include <RayMarch>
#include <get_normal>
#include <rand>
#include <init_object_cook_torrance>
#include <utils_cook>


vec3 Model_Illumination(in vec3 ray_intersect, in vec3 ray_origin,
                        in Material hit_object) {

  vec3 lightPosOffset = uRotatingLight *
                        vec3(sin(2. * uTime), 0, cos(2. * uTime)) *
                        0.5; // * 3.; //light is turning
  vec3 lightPos =
      vec3(uLightPositionX, uLightPositionY, uLightPositionZ) + lightPosOffset;
  vec3 lightPos2 = vec3(uLightPositionX2, uLightPositionY2, uLightPositionZ2) +
                   lightPosOffset;

  // some Maths stuff
  vec3 light_vector = normalize(lightPos - ray_intersect);
  vec3 light_vector2 = normalize(lightPos2 - ray_intersect);

  vec3 normal = get_normal(ray_intersect);

  vec3 ray_vector = normalize(ray_origin - ray_intersect);

  vec3 half_vector =
      normalize(light_vector + ray_vector); // the `half-angle` vector
  vec3 half_vector2 =
      normalize(light_vector2 + ray_vector); // the `half-angle` vector

  float diffuse = clamp(dot(light_vector, normal), 0., 1.);
  float diffuse2 = clamp(dot(light_vector2, normal), 0., 1.);

  float specular =
      clamp(dot(half_vector, normal), 0., 1.); // also called `blinn term`
  float specular2 =
      clamp(dot(half_vector2, normal), 0., 1.); // also called `blinn term`

        // shadow stuff
    vec3 position_offset = normal * SURF_DIST_MARCH * 1.2; // move the point above a little
    Material _; //useless stuff but needed for the next RayMarch
    float d = RayMarch(_, ray_intersect + position_offset, light_vector);
    float d2 = RayMarch(_, ray_intersect + position_offset, light_vector2);


    if (uShadow==1. && (d < length(lightPos - ray_intersect))) { // If true then we've shaded a point on some object before, 
                                    // so shade the currnet point as shodow.
        diffuse *= .3 ; // no half-shadow because the light source is a point.  
    }
    if (uShadow==1. && (uSecond_Light_on_off*d2 < uSecond_Light_on_off*length(lightPos2 - ray_intersect))) { // If true then we've shaded a point on some object before, 
        diffuse2 *= .3;  
    }

    //cook torrance stuff
  float nl = clamp(dot(normal, light_vector), 0., 1.);
  float nl2 = clamp(dot(normal, light_vector2), 0., 1.);
  float nv = clamp(dot(normal, ray_vector), 0., 1.);

  float distrib = GGX_Distribution(normal, half_vector, hit_object.roughness);
  float distrib2 = GGX_Distribution(normal, half_vector2, hit_object.roughness);

  vec3 fresnel = Fresnel(ray_vector, half_vector, 2.);
  vec3 fresnel2 = Fresnel(ray_vector, half_vector2, 2.);

  float g = G_cookTorrance(ray_vector, light_vector, normal, half_vector,
                           hit_object.roughness);

float g2 = G_cookTorrance(ray_vector, light_vector2, normal, half_vector,
                            hit_object.roughness);

  vec3 spec = (distrib * fresnel * g) / (nv * nl);

    vec3 spec2 = (distrib2 * fresnel2 * g2) / (nv * nl2);


  vec3 diff = diffuse * uColorLight * hit_object.base_color * (1. - fresnel / 2.);
  vec3 diff2 = uColorLight2 * hit_object.base_color * (1. - fresnel2 / 2.);


  vec3 col1 =  (spec + diff) * nl;
  vec3 col2 = diffuse2 * uSecond_Light_on_off * (spec2 + diff2) * nl2;


  vec3 col = col1+col2;
  return pow(col, vec3(0.8)); // Gama correction
}

#include <main>