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

let infoElement = document.getElementById('info');
infoElement.style.cursor = "default";
infoElement.style.userSelect = "none";
infoElement.style.MozUserSelect = "none";

let cameraInfoElement = document.getElementById('cameraInfo');
cameraInfoElement.style.cursor = "default";
cameraInfoElement.style.userSelect = "none";
cameraInfoElement.style.MozUserSelect = "none";

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
	SCREEN_WIDTH = document.body.clientWidth; //window.innerWidth; 
	SCREEN_HEIGHT = document.body.clientHeight; //window.innerHeight;

	renderer.setPixelRatio(pixelRatio);
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	pathTracingUniforms.uResolution.value.x = context.drawingBufferWidth;
	pathTracingUniforms.uResolution.value.y = context.drawingBufferHeight;

	pathTracingRenderTarget.setSize(context.drawingBufferWidth, context.drawingBufferHeight);

	worldCamera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	worldCamera.updateProjectionMatrix();

} // end function onWindowResize( event )



function init()
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
	container = document.getElementById('container');
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
			if ( (keyPressed('w') || button3Pressed) && !(keyPressed('x') || button4Pressed) )
			{
				// cameraControlsObject.position.add(cameraDirectionVector.multiplyScalar(camFlightSpeed * frameTime));
			}
			if ( (keyPressed('x') || button4Pressed) && !(keyPressed('w') || button3Pressed) )
			{
				// cameraControlsObject.position.sub(cameraDirectionVector.multiplyScalar(camFlightSpeed * frameTime));
			}
			if ( (keyPressed('q') || button1Pressed) && !(keyPressed('d') || button2Pressed) )
			{
				// cameraControlsObject.position.sub(cameraRightVector.multiplyScalar(camFlightSpeed * frameTime));
			}
			if ( (keyPressed('d') || button2Pressed) && !(keyPressed('q') || button1Pressed) )
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
