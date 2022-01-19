import ace from 'brace';
import 'brace/mode/glsl';
import 'brace/ext/language_tools'
import 'brace/snippets/glsl'
import 'brace/theme/chaos';

// theme terminal : 8/10
// theme twilight : 8/10
// theme clouds_midnight : 6/10

export class CodeEditor {
    #editor;

    constructor(container) {
        this.#editor = ace.edit(container);
        this.#editor.getSession().setMode('ace/mode/glsl');
        this.#editor.getSession().setUseWrapMode(true);
        this.#editor.setTheme('ace/theme/chaos');

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
        this.#editor.clearSelection();
        this.#editor.resize();
    }

    get_value() {
        return this.#editor.getValue();
    }

    set_value(text)
    {
        this.#editor.setValue(text);
        this.#editor.clearSelection();
    }

    resize()
    {
        this.#editor.resize();
    }
}