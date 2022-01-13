import './scss/index.scss';

import { slider } from './html_generators/slider.jsx';
import initCanvas from './canvas/InitCommon.js';

import Input from './canvas/Input.js';
import Slider from './canvas/Slider.js'
import Checkbox from './canvas/Checkbox.js'
import Shader from './canvas/Shader.js'

initCanvas();

let inputsShader = []
const checkbox = new Checkbox("Rotate light", "rotate_light", true);
const sliderTest = new Slider("Alpha", "alpha", 0,100,1);
inputsShader.push(checkbox);
inputsShader.push(sliderTest);

const shader = new Shader("Flat painting", './shaders/vertex/vertexShader.glsl', './shaders/fragment/flatPainting.glsl', inputsShader);

// Inputs
const inputs = document.getElementById('inputs');

const tmp = slider(1,"Alpha", "input1",1,100);

inputs.append(tmp);