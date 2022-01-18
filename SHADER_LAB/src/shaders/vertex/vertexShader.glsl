precision highp float;
precision highp int;

// #version 300 es
// precision mediump sampler2DArray;
// #define attribute in
// #define varying out
// attribute vec3 position;
// attribute vec2 uv;

out vec3 fragCoord;
out vec2 vertex_uv;

void main()
{
	fragCoord=position;
	vertex_uv=uv;
	gl_Position = vec4( position,1 );
}