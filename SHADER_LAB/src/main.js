import './scss/index.scss';

import { App } from './App.js'
import { slider } from './html_generators/slider.jsx';
import CodeMirror from 'codemirror';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css';

// APP
const app = new App();
app.run();

// Inputs
const inputs = document.getElementById('inputs');

const tmp = slider(1,"Alpha", "input1",1,100);

inputs.append(tmp);

// Textarea
const textarea = document.getElementById('editor');

const config = CodeMirror.EditorConfiguration = {
    tabSize: 3,
    lineNumbers: true,
    mode: 'xml',
    theme: 'monokai'
};

const editor = CodeMirror.fromTextArea(textarea, config);