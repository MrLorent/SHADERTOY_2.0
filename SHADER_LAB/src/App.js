import * as THREE from 'three';

import Scene from './Canvas/Scene.js'
import Shader from './Canvas/Shader.js'
import shaders_json from './shaders/shaders.json'

import initShaderChunk from "./Canvas/initShaderChunk.js";

export class App
{
    // LIST OF SHADERS
    FLAT_PAINTING = 0;
    LAMBERT = 1;
    PHONG = 2;

    scene;

    clock;
    frame_time;
    elapsed_time;

    list_of_shaders;
    current_shader;

    constructor(){
        // CREATING SCENE
        this.scene = new Scene();
        // It would be better to creat a Init method here to seperate the App initialisation from the Canvas initialisation
        this.scene.camera.fov = 31;
        this.clock = new THREE.Clock();
        
        initShaderChunk(THREE.ShaderChunk);
        
        // LOADING SHADERS
        this.list_of_shaders = [];
        for (let i in shaders_json){
            this.list_of_shaders.push(new Shader(shaders_json[i]))
        }

        // INITIALISE CURRENT SHADER
        this.current_shader = this.PHONG;

        this.link_shaders(this.scene, this.list_of_shaders[this.current_shader]);

        this.on_window_resize();

        // This listener on resize create error "this.scene is undefined" I don't know why
        // window.addEventListener(
        //     'resize',
        //     this.on_window_resize,
        //     false
        // );
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
        this.frame_time = this.clock.getDelta();
        this.elapsed_time = this.clock.getElapsedTime() % 1000;
    
        this.list_of_shaders[this.current_shader].uniforms.uTime.value = this.elapsed_time;
        this.scene.camera.updateMatrixWorld(true);
        this.list_of_shaders[this.current_shader].uniforms.uCameraPosition.value.copy(this.scene.camera.position);
    
        this.scene.renderer.setRenderTarget(null);
        this.scene.renderer.render(this.scene.scene, this.scene.camera);
    }

    on_window_resize()
    {
        let SCREEN_WIDTH = 800 ;
        let SCREEN_HEIGHT = 600 ;

        this.scene.renderer.setPixelRatio(1);
        this.scene.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        this.list_of_shaders[this.current_shader].uniforms.uResolution.value.x = this.scene.context.drawingBufferWidth;
        this.list_of_shaders[this.current_shader].uniforms.uResolution.value.y = this.scene.context.drawingBufferHeight;

        this.scene.target.setSize(this.scene.context.drawingBufferWidth, this.scene.context.drawingBufferHeight);

        this.scene.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        this.scene.camera.updateProjectionMatrix();
    }
}