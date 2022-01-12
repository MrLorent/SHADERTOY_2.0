precision highp float;
precision highp int;

out vec3 fragCoord;
out vec2 vuv;

void main()
{
	fragCoord=position;
	vuv=uv;
	gl_Position = vec4( position, 1.0 );
}
