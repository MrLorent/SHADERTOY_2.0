import * as THREE from 'three';
import vs from "../shaders/vertex/vertexShader.glsl"
import mainshader from "../shaders/fragment/phongIllumination.glsl"
import * as GLOBALS from "./globals.js";

//colors changera de taille quand on ajoutera des couleurs différentes par objet

function on_window_resize(event)
{

	GLOBALS.window_is_being_resized = true;

	let SCREEN_WIDTH = 800 ;
	let SCREEN_HEIGHT = 600 ;

	GLOBALS.renderer.setPixelRatio(GLOBALS.pixel_ratio);
	GLOBALS.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	GLOBALS.ray_marching_uniforms.uResolution.value.x = GLOBALS.context.drawingBufferWidth;
	GLOBALS.ray_marching_uniforms.uResolution.value.y = GLOBALS.context.drawingBufferHeight;

	GLOBALS.ray_marching_render_target.setSize(GLOBALS.context.drawingBufferWidth, GLOBALS.context.drawingBufferHeight);

	GLOBALS.world_camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	GLOBALS.world_camera.updateProjectionMatrix();

}



export default function init()
{
	window.addEventListener('resize', on_window_resize, false);

	//ici on mettra probablement des event de mouse

	GLOBALS.file_loader = new THREE.FileLoader();
	GLOBALS.colors=[new THREE.Color('blue'), new THREE.Color('white')]
	GLOBALS.kd=[0.4,0.7];
	GLOBALS.ks=[0.1,0.2];
	GLOBALS.ka=[0.9,0.4];
	GLOBALS.alpha=[30, 20];

	init_THREEjs(); 

}


function init_THREEjs()
{

	GLOBALS.renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector('canvas.webgl'),
		context: document.querySelector('canvas.webgl').getContext('webgl2')
	});
	GLOBALS.renderer.debug.checkShaderErrors = true;
	GLOBALS.renderer.autoClear = false;
	GLOBALS.renderer.toneMapping = THREE.ReinhardToneMapping;

	GLOBALS.context = GLOBALS.renderer.getContext();
	GLOBALS.context.getExtension('EXT_color_buffer_float');

	GLOBALS.clock = new THREE.Clock();

	GLOBALS.ray_marching_scene = new THREE.Scene();

	GLOBALS.world_camera = new THREE.PerspectiveCamera(60, document.body.clientWidth / document.body.clientHeight, 1, 1000);
	GLOBALS.ray_marching_scene.add(GLOBALS.world_camera);
	GLOBALS.world_camera.position.y=1;

	GLOBALS.ray_marching_render_target = new THREE.WebGLRenderTarget(GLOBALS.context.drawingBufferWidth, GLOBALS.context.drawingBufferHeight, {
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat,
		type: THREE.FloatType,
		depthBuffer: false,
		stencilBuffer: false
	});
	GLOBALS.ray_marching_render_target.texture.generateMipmaps = false;


	init_scene_data();

	GLOBALS.ray_marching_geometry = new THREE.PlaneBufferGeometry(2, 2);
	GLOBALS.ray_marching_uniforms = {
		uTime: { type: "f", value: 0.0 },
		uResolution: { type: "v2", value: new THREE.Vector2() },
		uCameraPosition: { type: "v3", value: new THREE.Vector3() },
		uRotatingLight: {value: 1}
	};

	init_ray_marching_shaders();

	on_window_resize();

	animate();

}


function animate()
{

	//servira pour les changements de cam
	GLOBALS.frame_time = GLOBALS.clock.getDelta();

	GLOBALS.elapsed_time = GLOBALS.clock.getElapsedTime() % 1000;

	if (GLOBALS.window_is_being_resized)
	{
		GLOBALS.window_is_being_resized = false;
	}

	// update scene
	update_variables_and_uniforms();
	GLOBALS.ray_marching_uniforms.uTime.value = GLOBALS.elapsed_time;

	// CAMERA
	GLOBALS.world_camera.updateMatrixWorld(true);
	GLOBALS.ray_marching_uniforms.uCameraPosition.value.copy(GLOBALS.world_camera.position);

	GLOBALS.renderer.setRenderTarget(null);
	GLOBALS.renderer.render(GLOBALS.ray_marching_scene, GLOBALS.world_camera);

	requestAnimationFrame(animate);

}


// called automatically from within initTHREEjs() function
function init_scene_data() 
{
    //en réalité le material a plutôt l'air choisi dans le shader donc je laisse ces valeurs les mêmes pour tous les objets
	GLOBALS.world_camera.fov = 31;
} 

function update(nameInput, value, inputArray, id){
	inputArray[id]=value
	nameInput.value = inputArray;
}

function updateLight(isRotating){
	GLOBALS.ray_marching_uniforms.uRotatingLight.value = isRotating;
}
function init_ray_marching_shaders() 
{

    GLOBALS.ray_marching_uniforms.uColors = {value: GLOBALS.colors}
    GLOBALS.ray_marching_uniforms.uKs={value: GLOBALS.ks}
    GLOBALS.ray_marching_uniforms.uKd={value: GLOBALS.kd}
    GLOBALS.ray_marching_uniforms.uKa={value: GLOBALS.ka}
    GLOBALS.ray_marching_uniforms.uAlpha={value: GLOBALS.alpha}

	//pas sure que ce soit utile
	GLOBALS.ray_marching_defines = {
		//NUMBER_OF_TRIANGLES: total_number_of_triangles
	};

	GLOBALS.file_loader.load(vs, function (shaderText) {
		GLOBALS.ray_marching_vertex_shader = shaderText;
		create_ray_marching_material();
	});

} 

function create_ray_marching_material() 
{

	GLOBALS.file_loader.load(mainshader, function (shaderText) {
		
		GLOBALS.ray_marching_fragment_shader = shaderText;

		GLOBALS.ray_marching_material = new THREE.ShaderMaterial({
			uniforms: GLOBALS.ray_marching_uniforms,
			defines: GLOBALS.ray_marching_defines,
			vertexShader: GLOBALS.ray_marching_vertex_shader,
			fragmentShader: GLOBALS.ray_marching_fragment_shader,
			depthTest: false,
			depthWrite: false
		});

		GLOBALS.ray_marching_mesh = new THREE.Mesh(GLOBALS.ray_marching_geometry, GLOBALS.ray_marching_material);
		GLOBALS.ray_marching_scene.add(GLOBALS.ray_marching_mesh);
		
		GLOBALS.world_camera.add(GLOBALS.ray_marching_mesh);
		
	});

} 



// servira pour tous les input d'objets pour mettre à
function update_variables_and_uniforms() 
{   
	update(GLOBALS.ray_marching_uniforms.uColors, new THREE.Color('white'), GLOBALS.colors, 0)
	update(GLOBALS.ray_marching_uniforms.uColors, new THREE.Color('#f34720'), GLOBALS.colors, 1)
	//update(GLOBALS.ray_marching_uniforms.uKd, 1, GLOBALS.kd, 1)
	update(GLOBALS.ray_marching_uniforms.uKa, 1, GLOBALS.ka, 1)
	updateLight(0)


}
