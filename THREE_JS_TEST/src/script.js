import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')
var gl=canvas.getContext('experimental-webgl');

// Scene
const scene = new THREE.Scene()

/** Raycaster */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor('#262837')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const objectsToTest=[]
const geometry = new THREE.SphereGeometry( 5, 32, 16 );
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
var vertices=[]; //points d'intersection
var taille=0; //taille vertices
const sphere = new THREE.Mesh( geometry, material );
var vertex_buffer = gl.createBuffer();


objectsToTest.push(sphere)

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1

})

document.addEventListener('click', (event) => 
{

    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1

    const sphereMouse = new THREE.Mesh( geometry, material );

    sphereMouse.position.x=mouse.x*30
    sphereMouse.position.y=mouse.y*20
    sphereMouse.position.z=0
    scene.add(sphereMouse)
    objectsToTest.push(sphereMouse)
    var startMouse = new Date()

    raytracing()

    //en principe pas besoin de ces fonctions, c'est  juste pour calculer le tps que met le calcul+tracé
    createVAO(vertices);
    createShaders();
    draw();

    var timeMouse = new Date() - startMouse
})

function rayIntersect(raycaster, objects){
    const intersects = raycaster.intersectObjects(objects)

    for(const intersect of intersects)
    {
        let point = intersect.point.add(intersect.object.position)
        vertices.push( point.x/30, point.y / 20 , 0);
        taille=taille+1;
    }
}


function raytracing(){
    for(let i=0; i<window.innerWidth; i+=3){
        let x = -1+2*(i/(window.innerWidth));
        for(let j=0; j<window.innerHeight; j+=3){
            let y=- (j / window.innerHeight) * 2 + 1 
            const raycaster_fenetre = new THREE.Raycaster()
            const rayOrigin = new THREE.Vector3(0,0,100)
            const rayDirection = new THREE.Vector3(x,y,-10)
            rayDirection.normalize()

            raycaster_fenetre.set(rayOrigin, rayDirection)

            rayIntersect(raycaster_fenetre, objectsToTest)
            
        }
    }
}

function createVAO(vertices){
    // var vertex_buffer = gl.createBuffer();

    //Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertex data to the buffer//
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function  createShaders(){
    // vertex shader source code
    var vertCode =
    'attribute vec3 coordinates;' +

    'void main(void) {' +
        ' gl_Position = vec4(coordinates, 1.0);' +
        'gl_PointSize = 2.0;'+
    '}';

    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);

    // Compile the vertex shader
    gl.compileShader(vertShader);

    // fragment shader source code
    var fragCode =
    'void main(void) {' +
        ' gl_FragColor = vec4(0.86, 0.63, 0.86, 0.1);' +
    '}';

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);

    // Compile the fragmentt shader
    gl.compileShader(fragShader);

    // Create a shader program object to store
    // the combined shader program
    var shaderProgram = gl.createProgram();

    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader); 

    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);

    // Link both programs
    gl.linkProgram(shaderProgram);

    // Use the combined shader program object
    gl.useProgram(shaderProgram);

    /*======== Associating shaders to buffer objects ========*/

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);
}

function draw(){
    // Clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, taille);
}


//Premier Raytracing AVANT le tick, on le rappelle quand on ajoute un objet
raytracing();

const tick = () =>
{
    createVAO(vertices);
    createShaders();
    draw();   
    window.requestAnimationFrame(tick)

}

tick()