import * as THREE from 'three';
import vs from "../shaders/vertex/vertexShader.glsl"
import mainshader from "../shaders/fragment/phongIllumination.glsl"
import * as GLOBAL from '../global.js';


var box_mesh = [];
var sphere_mesh = [];

var nb_boxes=3;
var nb_spheres=3;

let SCREEN_WIDTH;
let SCREEN_HEIGHT;
let context;
let ray_marching_scene;
let ray_marching_uniforms;
let ray_marching_defines;
let ray_marching_vertex_shader, ray_marching_fragment_shader;
let ray_marching_geometry, ray_marching_material, ray_marching_mesh;
let ray_marching_render_target;
let world_camera;
let renderer, clock;
let frame_time, elapsed_time;
let pixel_ratio =1;
let window_is_being_resized = false;
let file_loader = new THREE.FileLoader();

//colors changera de taille quand on ajoutera des couleurs différentes par objet
let colors=[new THREE.Color('blue'), new THREE.Color('white')]
let ks=[0.1,0.2]
let kd=[0.4,0.7]
let ka=[0.9,0.4]
let alpha=[30, 20]

function on_window_resize(event)
{

	window_is_being_resized = true;

	SCREEN_WIDTH = 800 ;
	SCREEN_HEIGHT = 600 ;

	renderer.setPixelRatio(pixel_ratio);
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	ray_marching_uniforms.uResolution.value.x = context.drawingBufferWidth;
	ray_marching_uniforms.uResolution.value.y = context.drawingBufferHeight;

	ray_marching_render_target.setSize(context.drawingBufferWidth, context.drawingBufferHeight);

	world_camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	world_camera.updateProjectionMatrix();

}



export default function init()
{
	GLOBAL.inputVal = 50;
	window.addEventListener('resize', on_window_resize, false);

	//ici on mettra probablement des event de mouse

	init_THREEjs(); 

}


function init_THREEjs()
{

	renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector('canvas.webgl'),
		context: document.querySelector('canvas.webgl').getContext('webgl2')
	});
	renderer.debug.checkShaderErrors = true;
	renderer.autoClear = false;
	renderer.toneMapping = THREE.ReinhardToneMapping;

	context = renderer.getContext();
	context.getExtension('EXT_color_buffer_float');

	clock = new THREE.Clock();

	ray_marching_scene = new THREE.Scene();

	world_camera = new THREE.PerspectiveCamera(60, document.body.clientWidth / document.body.clientHeight, 1, 1000);
	ray_marching_scene.add(world_camera);
	world_camera.position.y=1;

	ray_marching_render_target = new THREE.WebGLRenderTarget(context.drawingBufferWidth, context.drawingBufferHeight, {
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat,
		type: THREE.FloatType,
		depthBuffer: false,
		stencilBuffer: false
	});
	ray_marching_render_target.texture.generateMipmaps = false;


	init_scene_data();

	ray_marching_geometry = new THREE.PlaneBufferGeometry(2, 2);
	ray_marching_uniforms = {
		uTime: { type: "f", value: 0.0 },
		uResolution: { type: "v2", value: new THREE.Vector2() },
		uCameraPosition: { type: "v3", value: new THREE.Vector3() }
	};

	init_ray_marching_shaders();

	on_window_resize();

	animate();

}


function animate()
{

	//servira pour les changements de cam
	frame_time = clock.getDelta();

	elapsed_time = clock.getElapsedTime() % 1000;

	if (window_is_being_resized)
	{
		window_is_being_resized = false;
	}

	// update scene
	update_variables_and_uniforms();
	ray_marching_uniforms.uTime.value = elapsed_time;

	// CAMERA
	world_camera.updateMatrixWorld(true);
	ray_marching_uniforms.uCameraPosition.value.copy(world_camera.position);

	renderer.setRenderTarget(null);
	renderer.render(ray_marching_scene, world_camera);

	requestAnimationFrame(animate);

}


// called automatically from within initTHREEjs() function
function init_scene_data() 
{
    //en réalité le material a plutôt l'air choisi dans le shader donc je laisse ces valeurs les mêmes pour tous les objets
    let global_material = new THREE.MeshPhysicalMaterial( {
        color: new THREE.Color(0.0, 0.0, 0.95), 
        roughness: 0.2 
    } );

	// Boxes
    for (let i=0; i<nb_boxes; i++){
        let tmp_box_geometry = new THREE.BoxGeometry(1,1,1);
        box_mesh.push(new THREE.Mesh(tmp_box_geometry, global_material));
        ray_marching_scene.add(box_mesh[i]);
        box_mesh[i].visible = false;
        box_mesh[i].position.set(0, 0, 0);
        //box_mesh[i].rotation.set(0, Math.PI * 0.3, 0);
        box_mesh[i].updateMatrixWorld(true);
    }
    for (let i=0; i<nb_spheres; i++){
        let tmp_sphere_geometry = new THREE.SphereGeometry(1,1,1);
        sphere_mesh.push(new THREE.Mesh(tmp_sphere_geometry, global_material));
        ray_marching_scene.add(sphere_mesh[i]);
        sphere_mesh[i].visible = false; 
        //sphere_mesh[i].rotation.set(0, Math.PI * 0.1, 0);
        sphere_mesh[i].position.set(0, 0.5, 0);
        sphere_mesh[i].updateMatrixWorld(true);
    }

	world_camera.fov = 31;
} 

function update(nameInput, value, inputArray, id){
	inputArray[id]=value
	nameInput.value = inputArray;
}


function init_ray_marching_shaders() 
{

    //BOXES
    let box_matrixes= [];
    for(let i=0; i<nb_boxes; i++){
        box_matrixes.push(new THREE.Matrix4());
    }
    //on envoie les valeurs au shader via uniforms
    ray_marching_uniforms.uBoxInvMatrix =  { type: "Matrix4fv", value: box_matrixes }

    //SPHERES
    let sphere_matrixes= [];
    for(let i=0; i<nb_boxes; i++){
        sphere_matrixes.push(new THREE.Matrix4());
    }

    ray_marching_uniforms.uSphereInvMatrix =  { type: "Matrix4fv", value: sphere_matrixes }
    ray_marching_uniforms.uColors = {value: colors}
    ray_marching_uniforms.uKs={value: ks}
    ray_marching_uniforms.uKd={value: kd}
    ray_marching_uniforms.uKa={value: ka}
    ray_marching_uniforms.uAlpha={value: alpha}

	//pas sure que ce soit utile
	ray_marching_defines = {
		//NUMBER_OF_TRIANGLES: total_number_of_triangles
	};

	file_loader.load(vs, function (shaderText) {
		ray_marching_vertex_shader = shaderText;
		create_ray_marching_material();
	});

} 

function create_ray_marching_material() 
{

	file_loader.load(mainshader, function (shaderText) {
		
		ray_marching_fragment_shader = shaderText;

		ray_marching_material = new THREE.ShaderMaterial({
			uniforms: ray_marching_uniforms,
			defines: ray_marching_defines,
			vertexShader: ray_marching_vertex_shader,
			fragmentShader: ray_marching_fragment_shader,
			depthTest: false,
			depthWrite: false
		});

		ray_marching_mesh = new THREE.Mesh(ray_marching_geometry, ray_marching_material);
		ray_marching_scene.add(ray_marching_mesh);
		
		world_camera.add(ray_marching_mesh);
		
	});

} 



// servira pour tous les input d'objets pour mettre à
function update_variables_and_uniforms() 
{   
	update(ray_marching_uniforms.uColors, new THREE.Color('white'), colors, 0)
	update(ray_marching_uniforms.uColors, new THREE.Color('#f34720'), colors, 1)
	update(ray_marching_uniforms.uKd, 1, kd, 1)
	update(ray_marching_uniforms.uAlpha, GLOBAL.inputVal, alpha, 1)

	// BOXES
    let matrixes_world = [];
    for(let i=0; i<nb_boxes; i++){
        let matrix=box_mesh[i].matrixWorld.invert()
        matrixes_world.push(matrix.clone());
    }   

    ray_marching_uniforms.uBoxInvMatrix.value = matrixes_world;

	//SPHERES
    let matrixes_world_sphere = [];
    for(let i=0; i<nb_spheres; i++){
        let matrix=sphere_mesh[i].matrixWorld
        matrixes_world_sphere.push(matrix.clone());
    }   

    ray_marching_uniforms.uSphereInvMatrix.value = matrixes_world_sphere;

}
