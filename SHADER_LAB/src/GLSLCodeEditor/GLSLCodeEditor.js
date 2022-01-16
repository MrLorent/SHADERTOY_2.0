import ace from 'brace';
import 'brace/mode/glsl';
import 'brace/theme/monokai';

export class GLSLCodeEditor
{
    #editor;

    constructor(container)
    {
        this.#editor = ace.edit(container);
        this.#editor.getSession().setMode('ace/mode/glsl');
        this.#editor.setTheme('ace/theme/monokai');
        this.#editor.setFontSize("16px");
        this.#editor.setShowPrintMargin(false);
        this.#editor.setValue([
            '// Author:',
            '// Title:',
            '',
            '#ifdef GL_ES',
            'precision mediump float;',
            '#endif',
            '',
            'uniform vec2 u_resolution;',
            'uniform vec2 u_mouse;',
            'uniform float u_time;',
            '',
            'void main() {',
            '    vec2 st = gl_FragCoord.xy/u_resolution.xy;',
            '    st.x *= u_resolution.x/u_resolution.y;',
            '',
            'vec3 color = vec3(0.);',
            'color = vec3(st.x,st.y,abs(sin(u_time)));',
            '',
            'gl_FragColor = vec4(color,1.0);',
            '}',
            ''
          ].join('\n')
        );
        this.#editor.clearSelection();
    }
}