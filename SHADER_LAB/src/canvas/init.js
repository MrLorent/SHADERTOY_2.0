import on_window_resize from './windowResize.js'
import * as GLOBALS from "./globals.js";
import * as THREE from 'three';
import animate from './animate.js';
import load from './load_shaders.js'
import initShaderChunk from "./rayMarchingCommon.js"

export default function init(vertex, fragment){
    window.addEventListener('resize', on_window_resize(GLOBALS.scene, GLOBALS.shader), false);

    
	initShaderChunk(THREE.ShaderChunk)

    GLOBALS.clock = new THREE.Clock();

    GLOBALS.scene.camera.fov = 31;

    load(vertex, fragment);

    on_window_resize(GLOBALS.scene, GLOBALS.shader);
    animate()
}