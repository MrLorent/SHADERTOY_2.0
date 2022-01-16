import on_window_resize from './windowResize.js'
import * as GLOBALS from "./globals.js";
import * as THREE from 'three';
import animate from './animate.js';
import load from './load_shaders.js'
import initShaderChunk from "./rayMarchingCommon.js"

export default function init(scene, shader){
    window.addEventListener('resize', on_window_resize(scene, shader), false);

    
	initShaderChunk(THREE.ShaderChunk)

    GLOBALS.clock = new THREE.Clock();

    scene.camera.fov = 31;

    on_window_resize(scene, shader);
}