import * as THREE from 'three';

import Scene from './Canvas/Scene.js'
import Shader from './Canvas/Shader.js'
import shaders_json from './shaders/shaders.json'

import init from './Canvas/init.js'
import animate from './Canvas/animate.js'
import GLOBALS from './Canvas/globals.js'

export class App
{
    // LIST OF SHADERS
    FLAT_PAINTING = 0;
    LAMBERT = 1;
    PHONG = 2;

    scene;
    list_of_shaders;
    current_shader;

    constructor(){
        // CREATING SCENE
        this.scene = new Scene();
        
        // LOADING SHADERS
        this.list_of_shaders = [];
        for (let i in shaders_json){
            this.list_of_shaders.push(new Shader(shaders_json[i]))
        }

        // INITIALISE CURRENT SHADER
        this.current_shader = this.FLAT_PAINTING;
    }

    link_shaders(scene, shader){
        let file_loader = new THREE.FileLoader();
    
        file_loader.load(shader.vertex_shader_path, function(vs){
            shader.vertex_shader = vs;
            let material;
            file_loader.load(shader.fragment_shader_path, function(fs){
                shader.fragment_shader=fs;
            
    
                material = new THREE.ShaderMaterial({
                    uniforms: shader.uniforms,
                    vertexShader: shader.vertex_shader,
                    fragmentShader: shader.fragment_shader,
                    depthTest: false,
                    depthWrite: false
                });
    
                scene.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), material)
                scene.scene.add(scene.mesh)
                scene.camera.add(scene.mesh)
            });
        });
    }

    run()
    {
        this.link_shaders(this.scene, this.list_of_shaders[this.current_shader]);
        init(this.scene, this.list_of_shaders[this.current_shader]);
        GLOBALS.currentScene = this.scene;
        GLOBALS.currentShader=this.list_of_shaders[this.current_shader];

        animate();
    }
}
