import './scss/index.scss';

import { slider } from './html_generators/slider.jsx';
import initCanvas from './canvas/InitCommon.js';

initCanvas();

// Inputs
const inputs = document.getElementById('inputs');

const tmp = slider(1,"Alpha", "input1",1,100);

inputs.append(tmp);