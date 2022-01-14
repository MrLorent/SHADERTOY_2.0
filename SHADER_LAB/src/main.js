import './scss/index.scss';
//import { App } from './App.js';

// APP
// const app = new App();
// app.run();

// CANVAS
// import { maClass } from './fichierMaClasse'


// INPUTS
import { slider } from './html_generators/slider.jsx';

const inputs = document.getElementById('inputs');

const tmp = slider(1,"Alpha", "input1",1,100);

inputs.append(tmp);