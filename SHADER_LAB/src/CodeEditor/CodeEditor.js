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
        this.#editor.clearSelection();
    }

    get_editor() {
        return this.#editor;
    }
}