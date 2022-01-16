precision highp float;
precision highp int;

out vec3 fragCoord;
out vec2 vertex_uv;

void main()
{
	fragCoord=position;
	vertex_uv=uv;
	gl_Position = vec4( position, 1.0 );
}