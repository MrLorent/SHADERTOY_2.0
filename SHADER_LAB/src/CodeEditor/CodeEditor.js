import ace from 'brace';
import 'brace/mode/glsl';
import 'brace/ext/language_tools'
import 'brace/snippets/glsl'
import 'brace/theme/monokai';

export class CodeEditor {
    #editor;

    constructor(container) {
        this.#editor = ace.edit(container);
        this.#editor.getSession().setMode('ace/mode/glsl');
        this.#editor.setTheme('ace/theme/monokai');

        this.#editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,

            maxLines: Infinity,

            // Aesthetic
            fontSize: "1em",
            tabSize: 4,
            showPrintMargin: false
        });
        this.#editor.$blockScrolling = 'Infinity';
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
            '/// float u_rough roughness slider 0 1 ;',
            '',
            'void main() {',
            '    vec2 st = gl_FragCoord.xy/u_resolution.xy;',
            '    st.x *= u_resolution.x/u_resolution.y;',
            '',
            '    vec3 color = vec3(0.);',
            '    color = vec3(st.x,st.y,abs(sin(u_time)));',
            '',
            '    gl_FragColor = vec4(color,1.0);',
            '}',
            ''
        ].join('\n'));
        this.#editor.clearSelection();
    }

    get_editor() {
        return this.#editor;
    }
}