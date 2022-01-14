import on_window_resize from './windowResize.js'
import * as GLOBALS from "./globals.js";
import * as THREE from 'three';

export default function init(scene, shader){
    window.addEventListener('resize', on_window_resize(scene, shader), false);

    GLOBALS.clock = new THREE.Clock();

    scene.camera.fov = 31;

    on_window_resize(scene, shader);
}