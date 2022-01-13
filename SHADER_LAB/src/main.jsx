import './scss/index.scss';

import createElement from './createElement.jsx';
import initCanvas from './canvas/InitCommon.js';

initCanvas();

// Inputs
const inputs = document.getElementById('inputs');

// Setup some data
const name = 'Geoff'
const friends = ['Sarah', 'James', 'Hercule']

// Create some dom elements
const app = (
  <div className="app">
    <h1 className="title"> Hello, world! </h1>
    <p> Welcome back, {name} </p>
    <p>
      <strong>Your friends are:</strong>
    </p>
    <ul>
      {friends.map(name => (
        <li>{name}</li>
      ))}
    </ul>
  </div>
)
inputs.append(app);