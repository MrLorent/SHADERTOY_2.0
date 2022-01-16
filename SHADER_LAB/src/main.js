import './scss/index.scss';

import { App } from './App.js'
import { slider } from './html_generators/slider.jsx';
import { GLSLCodeEditor } from './GLSLCodeEditor/GLSLCodeEditor.js';
import * as THREE from 'three';

let FLAT_PAINTING = 0;
let LAMBERT = 1;
let PHONG = 2;

let SALLE = 0
let BOX = 1;
let SPHERE = 2;

// APP
const app = new App();
app.run(PHONG);

app.shaders[PHONG].update("color", new THREE.Color('white'), SALLE)
app.shaders[PHONG].update("color", new THREE.Color('green'), BOX)
app.shaders[PHONG].update("rotate_light",1)


// Inputs
const inputs = document.getElementById('inputs');

const tmp = slider(1,"Alpha", "input1",1,100);

inputs.append(tmp);

// GLSLCodeEditor
const codeEditor = new GLSLCodeEditor('glsl-editor');
