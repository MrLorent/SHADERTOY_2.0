import './scss/index.scss';
//import { App } from './App.js';
import { slider } from './html_generators/slider.jsx';

// APP
// const app = new App();
// app.run();

// Inputs
const inputs = document.getElementById('inputs');

const tmp = slider(1,"Alpha", "input1",1,100);

inputs.append(tmp);