precision highp float;
precision highp int;
precision highp sampler2D;

uniform bool uUseToneMapping;
uniform float uOneOverSampleCounter;
uniform sampler2D tPathTracedImageTexture;

void main()
{
        vec3 pixelColor=(texelFetch(tPathTracedImageTexture, ivec2(gl_FragCoord.xy), 0)).rgb;

        // lastly, apply gamma correction (gives more intensity/brightness range where it's needed)
        pc_fragColor = clamp(vec4( pow(pixelColor, vec3(0.4545)), 1.0 ), 0.0, 1.0);
}
