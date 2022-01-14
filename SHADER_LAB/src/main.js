import './scss/index.scss';

import { slider } from './html_generators/slider.jsx';

import Input from './canvas/Input.js';
import Slider from './canvas/Slider.js'
import Checkbox from './canvas/Checkbox.js'
import Shader from './canvas/Shader.js'

import vertex from './shaders/vertex/vertexShader.glsl'
import fragment from './shaders/fragment/phongIllumination.glsl'
import Scene from './canvas/Scene.js'

import init from './canvas/init.js'
import * as GLOBALS from './canvas/globals.js'

let inputsShader = []
const checkbox = new Checkbox("Rotate light", "rotate_light", true);
const sliderTest = new Slider("Alpha", "alpha", 0,100,1);
inputsShader.push(checkbox);
inputsShader.push(sliderTest);

GLOBALS.shader = new Shader("Flat painting", vertex, fragment, inputsShader);
GLOBALS.scene = new Scene();
console.log(GLOBALS.shader)
console.log(GLOBALS.scene)
// Inputs
const inputs = document.getElementById('inputs');

const tmp = slider(1,"Alpha", "input1",1,100);

init(vertex, fragment);

inputs.append(tmp);