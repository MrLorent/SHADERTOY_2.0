import * as THREE from 'three';
import vs from "../shaders/vertexShader.glsl"
import mainshader from "../shaders/simpleShader.glsl"


var sceneIsDynamic = false;
var camFlightSpeed = 300;
var boxMesh = [];
var sphereMesh = [];

var nbBoxes=3;
var nbSpheres=3;

let SCREEN_WIDTH;
let SCREEN_HEIGHT;
let canvas, context;
let container;
let pathTracingScene;
let pathTracingUniforms;
let pathTracingDefines;
let pathTracingVertexShader, pathTracingFragmentShader;
let pathTracingGeometry, pathTracingMaterial, pathTracingMesh;
let pathTracingRenderTarget;
let worldCamera;
let renderer, clock;
let frameTime, elapsedTime;


let pixelRatio = 0.5;
let windowIsBeingResized = false;
let TWO_PI = Math.PI * 2;
let frameCounter = 1.0; // 1 instead of 0 because it is used as a rng() seed in pathtracing shader
let cameraRecentlyMoving = false;
let isPaused = true;
let oldYawRotation, oldPitchRotation;
let mobileJoystickControls = null;
let mobileControlsMoveX = 0;
let mobileControlsMoveY = 0;
let oldPinchWidthX = 0;
let oldPinchWidthY = 0;
let fontAspect;
let useGenericInput = true;
let EPS_intersect;
let cameraRotationSpeed = 1;
let useToneMapping = true;
let display = false;

// the following variables will be used to calculate rotations and directions from the camera
let cameraDirectionVector = new THREE.Vector3(); //for moving where the camera is looking
let cameraRightVector = new THREE.Vector3(); //for strafing the camera right and left
let cameraUpVector = new THREE.Vector3(); //for moving camera up and down
//let cameraWorldQuaternion = new THREE.Quaternion(); //for rotating scene objects to match camera's current rotation

let PI_2 = Math.PI / 2; //used by controls below

let mouseControl = true;
let pointerlockChange;
let fileLoader = new THREE.FileLoader();

const KEYCODE_NAMES = {
	65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm',
	78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z',
	37: 'left', 38: 'up', 39: 'right', 40: 'down', 32: 'space', 33: 'pageup', 34: 'pagedown', 9: 'tab',
	189: 'dash', 187: 'equals', 188: 'comma', 190: 'period', 27: 'escape', 13: 'enter'
}
let KeyboardState = {
	a: false, b: false, c: false, d: false, e: false, f: false, g: false, h: false, i: false, j: false, k: false, l: false, m: false,
	n: false, o: false, p: false, q: false, r: false, s: false, t: false, u: false, v: false, w: false, x: false, y: false, z: false,
	left: false, up: false, right: false, down: false, space: false, pageup: false, pagedown: false, tab: false,
	dash: false, equals: false, comma: false, period: false, escape: false, enter: false
}

function onKeyDown(event)
{
	event.preventDefault();
	
	KeyboardState[KEYCODE_NAMES[event.keyCode]] = true;
}

function onKeyUp(event)
{
	event.preventDefault();
	
	KeyboardState[KEYCODE_NAMES[event.keyCode]] = false;
}

function keyPressed(keyName)
{
	if (!mouseControl)
		return;

	return KeyboardState[keyName];
}


function onMouseWheel(event)
{
	if (isPaused)
		return;
		
	// use the following instead, because event.preventDefault() gives errors in console
	event.stopPropagation(); 

	if (event.deltaY > 0)
	{
		increaseFOV = true;
	} 
	else if (event.deltaY < 0)
	{
		decreaseFOV = true;
	}
}


function onWindowResize(event)
{

	windowIsBeingResized = true;

	// the following change to document.body.clientWidth and Height works better for mobile, especially iOS
	// suggestion from Github user q750831855  - Thank you!
	SCREEN_WIDTH = 800 ;//document.body.clientWidth; //window.innerWidth; 
	SCREEN_HEIGHT = 600 ;//document.body.clientHeight; //window.innerHeight;

	renderer.setPixelRatio(pixelRatio);
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	pathTracingUniforms.uResolution.value.x = context.drawingBufferWidth;
	pathTracingUniforms.uResolution.value.y = context.drawingBufferHeight;

	pathTracingRenderTarget.setSize(context.drawingBufferWidth, context.drawingBufferHeight);

	worldCamera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	worldCamera.updateProjectionMatrix();

} // end function onWindowResize( event )



export default function init()
{

	window.addEventListener('resize', onWindowResize, false);

	if ('ontouchstart' in window)
	{
		mouseControl = false;

		mobileJoystickControls = new MobileJoystickControls({
			//showJoystick: true
		});
	}

	// if on mobile device, unpause the app because there is no ESC key and no mouse capture to do
	if (!mouseControl)
		isPaused = false;

	if (mouseControl)
	{

		window.addEventListener('wheel', onMouseWheel, false);

		document.body.addEventListener("click", function () {
			this.requestPointerLock = this.requestPointerLock || this.mozRequestPointerLock;
			this.requestPointerLock();
		}, false);

		window.addEventListener("click", function (event) {
			event.preventDefault();
		}, false);

		window.addEventListener("dblclick", function (event) {
			event.preventDefault();
		}, false);


		pointerlockChange = function (event)
		{
			if (document.pointerLockElement === document.body ||
				document.mozPointerLockElement === document.body || document.webkitPointerLockElement === document.body)
			{
				document.addEventListener('keydown', onKeyDown, false);
				document.addEventListener('keyup', onKeyUp, false);
				isPaused = false;
			}
			else
			{
				document.removeEventListener('keydown', onKeyDown, false);
				document.removeEventListener('keyup', onKeyUp, false);
				isPaused = true;
			}
		};

		// Hook pointer lock state change events
		document.addEventListener('pointerlockchange', pointerlockChange, false);
		document.addEventListener('mozpointerlockchange', pointerlockChange, false);
		document.addEventListener('webkitpointerlockchange', pointerlockChange, false);

	}

	initTHREEjs(); // boilerplate: init necessary three.js items and scene/demo-specific objects

} // end function init()



function initTHREEjs()
{

	canvas = document.createElement('canvas');

	renderer = new THREE.WebGLRenderer({ canvas: canvas, context: canvas.getContext('webgl2') });
	//suggestion: set to false for production
	renderer.debug.checkShaderErrors = true;

	renderer.autoClear = false;

	renderer.toneMapping = THREE.ReinhardToneMapping;

	//required by WebGL 2.0 for rendering to FLOAT textures
	context = renderer.getContext();
	context.getExtension('EXT_color_buffer_float');

	//Ici là où on définit le container donc à adapter selon comment Tanguy appelle la fenêtre
	container = document.querySelector('canvas.webgl');
	container.appendChild(renderer.domElement);

	clock = new THREE.Clock();

	pathTracingScene = new THREE.Scene();

	// worldCamera is the dynamic camera 3d object that will be positioned, oriented and 
	// constantly updated inside the 3d scene.  Its view will ultimately get passed back to the 
	// stationary quadCamera, which renders the scene to a fullscreen quad (made up of 2 large triangles).
	worldCamera = new THREE.PerspectiveCamera(60, document.body.clientWidth / document.body.clientHeight, 1, 1000);
	pathTracingScene.add(worldCamera);
	worldCamera.position.y=1;


	// setup render targets...
	pathTracingRenderTarget = new THREE.WebGLRenderTarget(context.drawingBufferWidth, context.drawingBufferHeight, {
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat,
		type: THREE.FloatType,
		depthBuffer: false,
		stencilBuffer: false
	});
	pathTracingRenderTarget.texture.generateMipmaps = false;


	// setup scene/demo-specific objects, variables, and data
	initSceneData();


	// setup screen-size quad geometry and shaders....

	// this full-screen quad mesh performs the path tracing operations and produces a screen-sized image
	pathTracingGeometry = new THREE.PlaneBufferGeometry(2, 2);
	//ces variables ne servent peut être pas ??
	pathTracingUniforms = {

		//uSceneIsDynamic: { type: "b1", value: sceneIsDynamic },

		uTime: { type: "f", value: 0.0 },
		uResolution: { type: "v2", value: new THREE.Vector2() },
		uCameraPosition: { type: "v3", value: new THREE.Vector3() }
	};

	initPathTracingShaders();

	// this 'jumpstarts' the initial dimensions and parameters for the window and renderer
	onWindowResize();

	// everything is set up, now we can start animating
	animate();

} // end function initTHREEjs()




function animate()
{

	frameTime = clock.getDelta();

	elapsedTime = clock.getElapsedTime() % 1000;


	if (windowIsBeingResized)
	{
		windowIsBeingResized = false;
	}


	// the following gives us a rotation quaternion (4D vector), which will be useful for 
	// rotating scene objects to match the camera's rotation
	//worldCamera.getWorldQuaternion(cameraWorldQuaternion);

	if (useGenericInput)
	{
		
		if (!isPaused)
		{
			if ( (keyPressed('w')) && !(keyPressed('x')))
			{
				// cameraControlsObject.position.add(cameraDirectionVector.multiplyScalar(camFlightSpeed * frameTime));
			}
			if ( (keyPressed('x')) && !(keyPressed('w')) )
			{
				// cameraControlsObject.position.sub(cameraDirectionVector.multiplyScalar(camFlightSpeed * frameTime));
			}
			if ( (keyPressed('q')) && !(keyPressed('d')) )
			{
				// cameraControlsObject.position.sub(cameraRightVector.multiplyScalar(camFlightSpeed * frameTime));
			}
			if ( (keyPressed('d')) && !(keyPressed('q') ))
			{
				// cameraControlsObject.position.add(cameraRightVector.multiplyScalar(camFlightSpeed * frameTime));
			}
			if (keyPressed('z') && !keyPressed('s'))
			{
				// cameraControlsObject.position.add(cameraUpVector.multiplyScalar(camFlightSpeed * frameTime));
			}
			if (keyPressed('s') && !keyPressed('z'))
			{
				// cameraControlsObject.position.sub(cameraUpVector.multiplyScalar(camFlightSpeed * frameTime));
			}
		} // end if (!isPaused)

	} // end if (useGenericInput)


	// update scene/demo-specific input(if custom), variables and uniforms every animation frame
	updateVariablesAndUniforms();

	pathTracingUniforms.uTime.value = elapsedTime;

	// CAMERA
	worldCamera.updateMatrixWorld(true);
	pathTracingUniforms.uCameraPosition.value.copy(worldCamera.position);

	// PROGRESSIVE SAMPLE WEIGHT (reduces intensity of each successive animation frame's image)

	renderer.setRenderTarget(null);
	renderer.render(pathTracingScene, worldCamera);


	// stats.update();

	requestAnimationFrame(animate);

} // end function animate()


// called automatically from within initTHREEjs() function
function initSceneData() 
{
    //en réalité le material a plutôt l'air choisi dans le shader donc je laisse ces valeurs les mêmes pour tous les objets
    let globalMaterial = new THREE.MeshPhysicalMaterial( {
        color: new THREE.Color(0.0, 0.0, 0.95), //RGB, ranging from 0.0 - 1.0
        roughness: 0.2 // ideal Diffuse material	
    } );
	// scene/demo-specific three.js objects setup goes here

	// pixelRatio is resolution - range: 0.5(half resolution) to 1.0(full resolution)
	pixelRatio = mouseControl ? 1.0 : 0.75; // less demanding on battery-powered mobile devices

	EPS_intersect = 0.01;

	// Boxes
    for (let i=0; i<nbBoxes; i++){
        let tmpBoxGeometry = new THREE.BoxGeometry(1,1,1);
        // let tmpBoxMaterial = new THREE.MeshPhysicalMaterial( {
        //     color: new THREE.Color(0.0, 0.0, 0.95), //RGB, ranging from 0.0 - 1.0
        //     roughness: 0.2 // ideal Diffuse material	
        // } );
        
        //tmpBoxMesh = new THREE.Mesh(tmpBoxGeometry, tmpBoxMaterial);
        boxMesh.push(new THREE.Mesh(tmpBoxGeometry, globalMaterial));
        pathTracingScene.add(boxMesh[i]);
        boxMesh[i].visible = false; // disable normal Three.js rendering updates of this object: 
        // it is just a data placeholder as well as an Object3D that can be transformed/manipulated by 
        // using familiar Three.js library commands. It is then fed into the GPU path tracing renderer
        // through its 'matrixWorld' matrix. See below:
        boxMesh[i].position.set(0, 0, 0);
        //boxMesh[i].rotation.set(0, Math.PI * 0.3, 0);
        boxMesh[i].updateMatrixWorld(true);
    }
    for (let i=0; i<nbSpheres; i++){
        let tmpSphereGeometry = new THREE.SphereGeometry(1,1,1);
        // let tmpSphereMaterial = new THREE.MeshPhysicalMaterial( {
        //     color: new THREE.Color(0.0, 0.0, 0.95), //RGB, ranging from 0.0 - 1.0
        //     roughness: 0.2 // ideal Diffuse material	
        // } );
        
        //tmpBoxMesh = new THREE.Mesh(tmpBoxGeometry, tmpBoxMaterial);
        sphereMesh.push(new THREE.Mesh(tmpSphereGeometry, globalMaterial));
        pathTracingScene.add(sphereMesh[i]);
        sphereMesh[i].visible = false; // disable normal Three.js rendering updates of this object: 
        // it is just a data placeholder as well as an Object3D that can be transformed/manipulated by 
        // using familiar Three.js library commands. It is then fed into the GPU path tracing renderer
        // through its 'matrixWorld' matrix. See below:
        //sphereMesh[i].rotation.set(0, Math.PI * 0.1, 0);
        sphereMesh[i].position.set(0, 0.5, 0);
        sphereMesh[i].updateMatrixWorld(true);
    }

    // 'true' forces immediate matrix update
	

	// set camera's field of view
	worldCamera.fov = 31;
	// focusDistance = 1180.0;

} // end function initSceneData()



// called automatically from within initTHREEjs() function
function initPathTracingShaders() 
{
	// scene/demo-specific uniforms go here  

    //BOXES
    let boxMatrixes= [];
    let boxColor = [];
    let boxType = [];
    for(let i=0; i<nbBoxes; i++){
        boxMatrixes.push(new THREE.Matrix4());
        boxColor.push(new THREE.Color('orange'));
        boxType.push(1);
    }
    boxType[1]=3;
    boxColor[1]=new THREE.Color('white');

    //on envoie les valeurs au shader via uniforms
    pathTracingUniforms.uBoxInvMatrix =  { type: "Matrix4fv", value: boxMatrixes }
    pathTracingUniforms.uBoxColor = { value: boxColor}
    pathTracingUniforms.uBoxType = { value: boxType}

    //SPHERES
    let sphereMatrixes= [];
    let sphereColor = [];
    let sphereType = [];
    for(let i=0; i<nbBoxes; i++){
        sphereMatrixes.push(new THREE.Matrix4());
        sphereColor.push(new THREE.Color('blue'));
        sphereType.push(1);
    }
    let colors = [new THREE.Color('white'),new THREE.Color('purple')];
    let k = [new THREE.Vector4(0.1,0.2,0.3,30), new THREE.Vector4(0.1,0.2,0.3,30)]

    pathTracingUniforms.uSphereInvMatrix =  { type: "Matrix4fv", value: sphereMatrixes }
    pathTracingUniforms.uSphereColor = { value: sphereColor}
    pathTracingUniforms.uSphereType = { value: sphereType}
    pathTracingUniforms.uColors = {value: colors}
    pathTracingUniforms.uK={value: k}

	
	pathTracingDefines = {
		//NUMBER_OF_TRIANGLES: total_number_of_triangles
	};

	// load vertex and fragment shader files that are used in the pathTracing material, mesh and scene
    pathTracingVertexShader=vs;
    createPathTracingMaterial();
	// fileLoader.load(vs, function (shaderText) {
	// 	pathTracingVertexShader = shaderText;

	// 	createPathTracingMaterial();
	// });

} // end function initPathTracingShaders()


// called automatically from within initPathTracingShaders() function above
function createPathTracingMaterial() 
{
    pathTracingFragmentShader = mainshader;

    pathTracingMaterial = new THREE.ShaderMaterial({
        uniforms: pathTracingUniforms,
        defines: pathTracingDefines,
        vertexShader: pathTracingVertexShader,
        fragmentShader: pathTracingFragmentShader,
        depthTest: false,
        depthWrite: false
    });

    pathTracingMesh = new THREE.Mesh(pathTracingGeometry, pathTracingMaterial);
    pathTracingScene.add(pathTracingMesh);

    // the following keeps the large scene ShaderMaterial quad right in front 
    //   of the camera at all times. This is necessary because without it, the scene 
    //   quad will fall out of view and get clipped when the camera rotates past 180 degrees.
    worldCamera.add(pathTracingMesh);

	// fileLoader.load('shaders/simpleShader.glsl', function (shaderText) {
		
	// 	pathTracingFragmentShader = shaderText;

	// 	pathTracingMaterial = new THREE.ShaderMaterial({
	// 		uniforms: pathTracingUniforms,
	// 		defines: pathTracingDefines,
	// 		vertexShader: pathTracingVertexShader,
	// 		fragmentShader: pathTracingFragmentShader,
	// 		depthTest: false,
	// 		depthWrite: false
	// 	});

	// 	pathTracingMesh = new THREE.Mesh(pathTracingGeometry, pathTracingMaterial);
	// 	pathTracingScene.add(pathTracingMesh);

	// 	// the following keeps the large scene ShaderMaterial quad right in front 
	// 	//   of the camera at all times. This is necessary because without it, the scene 
	// 	//   quad will fall out of view and get clipped when the camera rotates past 180 degrees.
	// 	worldCamera.add(pathTracingMesh);
		
	// });

} // end function createPathTracingMaterial()



// called automatically from within the animate() function
function updateVariablesAndUniforms() 
{   
	// BOXES
    let matrixesWorld = [];
    for(let i=0; i<nbBoxes; i++){
        let matrix=boxMesh[i].matrixWorld.invert()
        matrixesWorld.push(matrix.clone());
    }   

    pathTracingUniforms.uBoxInvMatrix.value = matrixesWorld;

    let matrixesWorldSphere = [];
    for(let i=0; i<nbSpheres; i++){
        let matrix=sphereMesh[i].matrixWorld
        matrixesWorldSphere.push(matrix.clone());
    }   

    pathTracingUniforms.uSphereInvMatrix.value = matrixesWorldSphere;

	// INFO
	// cameraInfoElement.innerHTML = "FOV: " + worldCamera.fov + " / Aperture: " + apertureSize.toFixed(2) + " / FocusDistance: " + focusDistance + "<br>" + "Samples: " + sampleCounter;

} // end function updateVariablesAndUniforms()
