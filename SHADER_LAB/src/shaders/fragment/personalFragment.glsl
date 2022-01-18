#include <uniforms_and_defines>

/// slider uKs specular 0 1 0.01
/// slider uKa ambiant 0 1 0.01
/// slider uKd diffus 0 1 0.01
/// slider uAlpha alpha 0 100 1
/// color_picker uColors color
/// checkbox uRotatingLight rotate_light

in vec2 vertex_uv;

#include <creation_scene>
#include <RayMarch>
#include <get_normal>
#define GetNormal GetNormalEulerTwoSided
#include <rand>

// To create an uniform value and to get a slider linked to it : 
// /// color_picker uName name
// /// checkbox uName name
// /// slider uName name min max step

void main()
{
    pc_fragColor = vec4(vec3(0., 1., 0.), 1.0);
}