#include <uniforms_and_defines>

/// color_picker scene uColors colors
/// slider scene uRoughness roughness 0 1 0.01

/// checkbox light uRotatingLight rotate_light

/// color_picker light uColorLight color_light
/// slider light uLightPositionX positionX_light -2. 2. 0.1
/// slider light uLightPositionY positionY_light 1 4. 0.1
/// slider light uLightPositionZ positionZ_light 1 5 0.1

/// color_picker light uColorLight2 color_light2
/// slider light uLightPositionX2 positionX_light2 -2. 2. 0.1
/// slider light uLightPositionY2 positionY_light2 1 4. 0.1
/// slider light uLightPositionZ2 positionZ_light2 1 5 0.1

/// checkbox light uSecond_Light_on_off preset
/// checkbox light uShadow shadow_on_off

#include <creation_object>
#include <dot2>
#include <scene_preset_0>
#include <RayMarch>
#include <get_normal>
#include <rand>
#include <init_object_cook_torrance>

float chiGGX(float v) { return (v > 0. ? 1. : 0.); }

float GGX_Distribution(vec3 n, vec3 h, float alpha) {
  float NoH = dot(n, h);
  float alpha2 = alpha * alpha;
  float NoH2 = NoH * NoH;
  float den = NoH2 * alpha + (1. - NoH2);
  return (chiGGX(NoH) * alpha2) / (3.14 * den * den);
}

float GGX_PartialGeometryTerm(vec3 v, vec3 n, vec3 h, float alpha) {
  float VoH2 = clamp(dot(v, h), 0., 1.);
  float VoN2 = clamp(dot(v, n), 0., 1.);
  float chi = chiGGX(VoH2 / VoN2);
  VoH2 = VoH2 * VoH2;
  VoN2 = VoN2 * VoN2;
  float tan2 = (1. - VoN2) / VoN2;
  return (2. * chi) / (1. + sqrt(1. + alpha * alpha * tan2));
}

float G_cookTorrance(vec3 v, vec3 l, vec3 n, vec3 h, float alpha) {
  float g_v = GGX_PartialGeometryTerm(normalize(v), n, h, alpha);
  float g_l = GGX_PartialGeometryTerm(normalize(l), n, h, alpha);
  return g_l * g_v;
}

vec3 Fresnel(vec3 v, vec3 h, float ior) {
  float cosT = clamp(dot(h, v), 0., 1.);
  vec3 F0 = vec3(abs((1.0 - ior) / (1.0 + ior)));
  return F0 + (1. - F0) * pow(1. - cosT, 5.);
}

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

  vec3 view_vector = normalize(ray_intersect - ray_origin);

  float nl = clamp(dot(normal, light_vector), 0., 1.);
  float nv = clamp(dot(normal, ray_vector), 0., 1.);

  float d = GGX_Distribution(normal, half_vector, hit_object.roughness);

  vec3 f = Fresnel(ray_vector, half_vector, 2.);

  float g = G_cookTorrance(ray_vector, light_vector, normal, half_vector,
                           hit_object.roughness);

  vec3 ct = f * f * (0.25 * d * g / nv);

  /*    float diff = max(nl, 0.0);
   */
  vec3 spec = (d * f * g) / (nv * nl);

  vec3 diff = uColorLight * hit_object.base_color * (1. - f / 2.);

  vec3 col1 = (spec + diff) * nl;

  // col1 *=ct*hit_object.ks + diff*hit_object.kd;

  // Blinn-Phong stuff
  // vec3 col1 =  hit_object.base_color/3.14;

  /*    vec3 cook = dfg/(LoN*VoN*2.);

      vec3 col1 = uColorLight * hit_object.base_color;
      col1 = col1 * hit_object.kd * diffuse + cook * pow(specular,
     hit_object.shininess);*/
  // col1=(hit_object.base_color+uColorLight*cook)*LoN;
  // col1 =col1+hit_object.ks*G_cookTorrance(ray_vector, light_vector, normal,
  // half_vector, hit_object.roughness)*Fresnel(ray_vector, half_vector, normal,
  // 0.5)*GGX_Distribution(normal, half_vector,
  // hit_object.roughness)/(4.*(dot(ray_vector, normal))*dot(light_vector,
  // normal));

  vec3 col = col1;
  return pow(col, vec3(0.8)); // Gama correction
}

#include <main>