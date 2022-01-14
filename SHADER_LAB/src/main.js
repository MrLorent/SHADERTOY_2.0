import './scss/index.scss';
import { App } from './App.js'
import { slider } from './html_generators/slider.jsx';

let FLAT_PAINTING = 0;
let LAMBERT = 1;
let PHONG = 2;

// APP
const app = new App();
app.run(PHONG);


// Inputs
const inputs = document.getElementById('inputs');

const tmp = slider(1,"Alpha", "input1",1,100);

inputs.append(tmp);