import * as GLOBALS from "./globals.js";
import * as THREE from 'three';

export default function loadShaders(vertex_shader_path, fragment_shader_path){
    let file_loader = new THREE.FileLoader();
    file_loader.load(vertex_shader_path, function(vs){
        GLOBALS.shader.vertex_shader = vs;
    });
    file_loader.load(fragment_shader_path, function(fs){
        GLOBALS.shader.fragment_shader=fs;

        let material = new THREE.ShaderMaterial({
            uniforms: GLOBALS.shader.uniforms,
            vertexShader: GLOBALS.shader.vertex_shader,
            fragmentShader: GLOBALS.shader.fragment_shader,
            depthTest: false,
            depthWrite: false
        });

        GLOBALS.scene.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), material)
        GLOBALS.scene.scene.add(GLOBALS.scene.mesh)
        GLOBALS.scene.camera.add(GLOBALS.scene.mesh)

    });
}