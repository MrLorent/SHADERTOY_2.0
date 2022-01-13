import './scss/index.scss';

import { slider } from './html_generators/slider.jsx';
import initCanvas from './canvas/InitCommon.js';

initCanvas();

// Inputs
const inputs = document.getElementById('inputs');

const tmp = slider(1,"Input 1", "input1",0,100);

inputs.append(tmp);