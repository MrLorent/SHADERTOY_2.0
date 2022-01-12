import './scss/style.scss';
import * as THREE from 'three';

import createElement from './createElement.jsx';

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Inputs
const inputs = document.querySelector('div.inputs');

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