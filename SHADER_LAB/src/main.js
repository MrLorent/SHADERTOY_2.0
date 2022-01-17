import './scss/index.scss';

import { App } from './App.js'
import slider_as_HTML from './Inputs/html_generators/slider.jsx';
import { CodeEditor } from './CodeEditor/CodeEditor.js';
import * as THREE from 'three';

let SALLE = 0
let BOX = 1;
let SPHERE = 2;

// 
const app = new App();

function animate(){
    app.run()
    requestAnimationFrame(animate)
}

animate();

// TMP
const PHONG = 2;

app.list_of_shaders[app.current_shader].update("color", new THREE.Color('white'), SALLE)
app.list_of_shaders[app.current_shader].update("color", new THREE.Color('green'), BOX)
app.list_of_shaders[app.current_shader].update("rotate_light",1)


// Inputs
const inputs = document.getElementById('inputs');

const tmp = slider_as_HTML(1,"Alpha", "input1",1,100);

inputs.append(tmp);

// GLSLCodeEditor
const codeEditor = new CodeEditor('glsl-editor');