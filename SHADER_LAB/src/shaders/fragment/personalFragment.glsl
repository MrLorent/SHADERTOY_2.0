#include <uniforms_and_defines>

in vec2 vertex_uv;

#include <creation_scene>
#include <RayMarch>
#include <get_normal>
#define GetNormal GetNormalEulerTwoSided
#include <rand>
#include <main_personal>

// To create an uniform value and to get a slider linked to it : 
// /// uName name min max step