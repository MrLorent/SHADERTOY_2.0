import * as GLOBALS from "./globals.js";
import * as THREE from 'three';

export default function loadShaders(id, scene, shaders, shaders_json){
    let file_loader = new THREE.FileLoader();

    file_loader.load(shaders_json['shader'+id][0]['vertex'], function(vs){
        shaders[id].vertex_shader = vs;
    });
    let material;
    file_loader.load(shaders_json['shader'+id][0]['fragment'], function(fs){
        shaders[id].fragment_shader=fs;
    

        material = new THREE.ShaderMaterial({
            uniforms: shaders[id].uniforms,
            vertexShader: shaders[id].vertex_shader,
            fragmentShader: shaders[id].fragment_shader,
            depthTest: false,
            depthWrite: false
        });

        scene.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), material)
        scene.scene.add(scene.mesh)
        scene.camera.add(scene.mesh)

    });
}