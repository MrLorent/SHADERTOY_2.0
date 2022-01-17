import * as THREE from 'three';

import Scene from './Canvas/Scene.js'
import Shader from './Canvas/Shader.js'
import shaders_json from './shaders/shaders.json'
import { CodeEditor } from './CodeEditor/CodeEditor.js';
import { CodeReader, codeChecker } from './CodeEditor/CodeReader.js';

import initShaderChunk from "./Canvas/initShaderChunk.js";

export class App
{
    // LIST OF SCENE ELEMENTS
    SALLE = 0
    BOX = 1;
    SPHERE = 2;
    SCENE_ELEMENTS = 2;

    // LIST OF SHADERS
    FLAT_PAINTING = 0;
    LAMBERT = 1;
    PHONG = 2;
    PERSONAL = 3;

    scene;

    codeEditor;
    codeReader;

    clock;
    frame_time;
    elapsed_time;

    list_of_shaders;
    current_shader;

    constructor(list_of_shaders){
        // CREATING SCENE
        this.scene = new Scene();
        // It would be better to creat a Init method here to seperate the App initialisation from the Canvas initialisation
        this.scene.camera.fov = 31;
        this.clock = new THREE.Clock();

        this.list_of_shaders = list_of_shaders;

        // // INITIALISE CURRENT SHADER
        this.current_shader = this.LAMBERT;

        initShaderChunk(THREE.ShaderChunk);

        // GLSLCodeEditor
        this.codeEditor = new CodeEditor('glsl-editor');
        this.codeReader = new CodeReader();
        this.codeEditor.getEditor().setValue(this.list_of_shaders[this.current_shader].fragment_shader);
        //this.codeEditor.getEditor().setValue(this.codeReader.analyzeText(this.codeEditor.getEditor().getValue(), this.list_of_shaders[this.current_shader]));

  
        THREE.ShaderChunk['main_personal']=this.codeReader.analyzeText(this.codeEditor.getEditor().getValue(), this.list_of_shaders[this.current_shader]);

        this.create_material();

        this.on_window_resize();

        // This listener on resize create error "this.scene is undefined" I don't know why
        // window.addEventListener(
        //     'resize',
        //     this.on_window_resize,
        //     false
        // );

        this.insert_inputs_in_HTML()
    }

    create_material(){
        let material = new THREE.ShaderMaterial({
            uniforms: this.list_of_shaders[this.current_shader].uniforms,
            vertexShader: this.list_of_shaders[this.current_shader].vertex_shader,
            fragmentShader: this.list_of_shaders[this.current_shader].fragment_shader,
            depthTest: false,
            depthWrite: false
        });
    
        this.scene.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), material)
        this.scene.scene.add(this.scene.mesh)
        this.scene.camera.add(this.scene.mesh)

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

    insert_inputs_in_HTML()
    {
        const shader = this.list_of_shaders[this.current_shader];
        const HTML_container = document.getElementById('inputs');
        const inputs = shader.get_inputs();

        for(let k=1; k<=this.SCENE_ELEMENTS; k++)
        {
            for(let i in inputs)
            {
                console.log(inputs[i]);
                HTML_container.append(inputs[i].get_as_HTML(k, shader));
            }
        }
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