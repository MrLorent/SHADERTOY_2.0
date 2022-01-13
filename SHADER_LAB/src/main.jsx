import './scss/index.scss';

import { app } from './html/html_generators/slider.jsx';
import initCanvas from './canvas/InitCommon.js';

initCanvas();

// Inputs
const inputs = document.getElementById('inputs');

const tmp = app;

inputs.append(tmp);