import * as THREE from 'three';

import Scene from './Canvas/Scene.js'
import { CodeEditor } from './CodeEditor/CodeEditor.js';
import { CodeReader } from './CodeEditor/CodeReader.js';

import init_shader_chunk from "./Canvas/init_shader_chunk.js";

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

    list_of_shaders;
    current_shader;

    constructor(list_of_shaders){
        // SCENE
        this.scene = new Scene();

        // SHADERS
        this.list_of_shaders = list_of_shaders;
        this.current_shader = this.PHONG;
        init_shader_chunk(THREE.ShaderChunk);
        this.init_shader();

        // CODE_EDITOR
        this.codeEditor = new CodeEditor('glsl-editor');
        this.codeReader = new CodeReader();
        this.codeEditor.get_editor().setValue(this.list_of_shaders[this.current_shader].fragment_shader);
        //this.codeEditor.getEditor().setValue(this.codeReader.analyzeText(this.codeEditor.getEditor().getValue(), this.list_of_shaders[this.current_shader]));
        THREE.ShaderChunk['main_personal']=this.codeReader.analyzeText(this.codeEditor.get_editor().getValue(), this.list_of_shaders[this.current_shader]);

        // WINDOW MANAGEMENT
        this.on_window_resize(this.scene, this.list_of_shaders[this.current_shader]);
        window.addEventListener(
            'resize',
            () => { this.on_window_resize(this.scene, this.list_of_shaders[this.current_shader]); },
            false
        );
    }

    init_shader()
    {
        this.init_material();
        this.insert_inputs_in_HTML();
    }

    init_material(){
        let material = new THREE.ShaderMaterial({
            uniforms: this.list_of_shaders[this.current_shader].uniforms,
            vertexShader: this.list_of_shaders[this.current_shader].vertex_shader,
            fragmentShader: this.list_of_shaders[this.current_shader].fragment_shader,
            depthTest: false,
            depthWrite: false
        });
    
        this.scene.mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2,2),
            material
        );
        this.scene.scene.add(this.scene.mesh);
        this.scene.camera.add(this.scene.mesh);

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

    render()
    {
        this.scene.frame_time = this.scene.clock.getDelta();
        this.scene.elapsed_time = this.scene.clock.getElapsedTime() % 1000;
    
        this.list_of_shaders[this.current_shader].uniforms.uTime.value = this.scene.elapsed_time;
        this.scene.camera.updateMatrixWorld(true);
        this.list_of_shaders[this.current_shader].uniforms.uCameraPosition.value.copy(this.scene.camera.position);
    
        this.scene.renderer.setRenderTarget(null);
        this.scene.renderer.render(this.scene.scene, this.scene.camera);
    }

    on_window_resize(scene, current_shader)
    {
        let SCREEN_WIDTH = 800 ;
        let SCREEN_HEIGHT = 600 ;

        scene.renderer.setPixelRatio(1);
        scene.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        current_shader.uniforms.uResolution.value.x = scene.context.drawingBufferWidth;
        current_shader.uniforms.uResolution.value.y = scene.context.drawingBufferHeight;

        scene.target.setSize(scene.context.drawingBufferWidth, scene.context.drawingBufferHeight);

        scene.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        scene.camera.updateProjectionMatrix();
    }
}