import * as THREE from 'three';

import Scene from './Canvas/Scene.js'
import init_shader_chunk from "./Canvas/init_shader_chunk.js";

import nav_bar_as_HTML from './nav_bar.jsx';
import input_fieldset_as_HTML from './input_fieldset.jsx';
import switch_input_panel_button from './switch_input_panel_button.jsx';
import compile_button_as_HTML from './compile_button.jsx'
import doc_button_as_HTML from './doc_button.jsx';
import scene_button_as_HTML from './scene_button.jsx';
import light_button_as_HTML from './light_button.jsx';


import { CodeEditor } from './CodeEditor.js';

export class App
{
    // LIST OF SCENE ELEMENTS
    SCENE = 0
    BOX = 1;
    SPHERE = 2;
    SCENE_ELEMENTS = 2;

    // LIST OF SHADERS
    FLAT_PAINTING = 0;
    LAMBERT = 1;
    LAMBERT_WITH_BOUNCE = 2;
    PHONG = 3;
    PERSONAL = 4;

    NUMERO_PRESET=0;

    scene;

    codeEditor;

    shader_list;
    current_shader;

    #material;

    constructor(shader_list){
        // CODE_EDITOR
        this.codeEditor = new CodeEditor('code_editor');
        this.insert_compile_button();

        // INIT LIST OF SHADERS
        this.shader_list = shader_list;
        for(let i in this.shader_list)
        {
            this.shader_list[i].set_fragment_shader(this.codeEditor.compile_inputed_uniforms(this.shader_list[i].fragment_shader, this.shader_list[i], this.NUMERO_PRESET));
            this.shader_list[i].init_material();
        }
        init_shader_chunk(THREE.ShaderChunk);
        this.insert_shader_buttons_in_HTML();

        // INIT CURRENT SHADER
        this.current_shader = this.FLAT_PAINTING;
        this.insert_inputs_in_HTML();

        // SCENE
        this.scene = new Scene();
        this.scene.init(this.shader_list[this.current_shader].get_material());

        // SETUP CURRENT SHADER
        this.codeEditor.set_value(this.shader_list[this.current_shader].fragment_shader);
        this.update_shader();

        
        
        // WINDOW MANAGEMENT
        this.on_window_resize(this.scene, this.shader_list[this.current_shader]);
        window.addEventListener(
            'resize',
            () => { this.on_window_resize(this.scene, this.shader_list[this.current_shader]); },
            false
        );

        // NAVIGATION
        this.insert_switch_input_panel_button_in_HTML();
        this.insert_scene_buttons_in_HTML();
        this.insert_light_buttons_in_HTML();
    }

    switch_shader(new_shader_id)
    {
        /* We change the current shader id */
        this.current_shader = new_shader_id;
        this.scene.update(this.shader_list[this.current_shader].get_material());
        this.insert_inputs_in_HTML();
        this.on_window_resize(this.scene, this.shader_list[this.current_shader]);
        this.codeEditor.set_value(this.shader_list[this.current_shader].fragment_shader);
        
        let doc_button = document.querySelector('#doc_button');
        if(this.current_shader == this.PERSONAL && !doc_button)
        {
            console.log("hello")
            let console_container = document.querySelector('#code_editor_panel');
            console_container.append(doc_button_as_HTML());
        }
        else if(this.current_shader != this.PERSONAL && doc_button)
        {
            doc_button.remove();
        }
    }

    update_shader()
    {
        let console = document.getElementById('console');
        let user_shader_input = this.codeEditor.get_value();
        user_shader_input = this.codeEditor.compile_inputed_uniforms(user_shader_input, this.shader_list[this.current_shader], this.NUMERO_PRESET);

        const compilation_test = this.codeEditor.check_shader_compilation(this.scene, user_shader_input, this.NUMERO_PRESET);
        if(compilation_test.status === "success")
        {
            this.shader_list[this.current_shader].fragment_shader = user_shader_input;
            this.shader_list[this.current_shader].update_material();
            this.switch_shader(this.current_shader);
            console.classList.remove('fail');
        }
        else
        {
            console.classList.add('fail');
        }

        console.innerHTML = "\\> " + compilation_test.message;
    }

    update_preset(preset)
    {
        let new_text = this.codeEditor.change_scene_include(this.NUMERO_PRESET, preset);
        this.NUMERO_PRESET = preset;

        this.shader_list[this.current_shader].fragment_shader = new_text;
        this.shader_list[this.current_shader].update_material();
        this.switch_shader(this.current_shader);
    }

    update_light(preset)
    {
        this.shader_list[this.current_shader].uniforms.uSecond_Light_on_off.value = preset;
        if(this.shader_list[this.current_shader].uniforms.uSecond_Light_on_off.value === 1)
        {
            this.shader_list[this.current_shader].uniforms.uColorLight.value = new THREE.Color("red");
        }
        if(this.shader_list[this.current_shader].uniforms.uSecond_Light_on_off.value === 0)
        {
           this.shader_list[this.current_shader].uniforms.uColorLight.value = new THREE.Color("white");
        }
        this.switch_shader(this.current_shader);
    }

    insert_scene_buttons_in_HTML()
    {
        const navigation_panel = document.querySelector('#visual_window .input_container.scene');
        navigation_panel.append(scene_button_as_HTML(this,0));
        navigation_panel.append(scene_button_as_HTML(this,1));
    }

    insert_light_buttons_in_HTML()
    {
        const navigation_panel = document.querySelector('#visual_window .input_container.light');
        navigation_panel.append(light_button_as_HTML(this, 0));
        navigation_panel.append(light_button_as_HTML(this, 1));
    }

    insert_switch_input_panel_button_in_HTML()
    {
        const navigation_panel = document.getElementById('navigation_panel');
        navigation_panel.append(switch_input_panel_button());
    }

    insert_compile_button()
    {
        const code_editor_buttons = document.getElementById('code_editor_panel');
        code_editor_buttons.append(compile_button_as_HTML(this));
    }

    insert_shader_buttons_in_HTML()
    {
        const header = document.querySelector('header');

        let shaders_name = [];
        let shaders_id = [];

        for(let i in this.shader_list)
        {
            shaders_name.push(this.shader_list[i].get_name());
            shaders_id[this.shader_list[i].get_name()] = i;
        }
        header.append(nav_bar_as_HTML(shaders_name, shaders_id, this));
    }

    insert_inputs_in_HTML()
    {
        const HTML_container = document.querySelector('#interactive_window .input_container');
        while(HTML_container.firstElementChild){
            HTML_container.removeChild(HTML_container.firstElementChild);
        }
        HTML_container.innerHTML = ""

        const shader = this.shader_list[this.current_shader];
        const light_inputs = shader.get_light_inputs();

        if(light_inputs.length != 0)
        {
            let light_input_container = input_fieldset_as_HTML(light_inputs, "light parameters :");

            for(let i in light_inputs)
            {
                light_input_container.append(light_inputs[i].get_as_HTML(this.SCENE, shader));
            }
            HTML_container.append(light_input_container);
        }

        const scene_inputs = shader.get_scene_inputs();

        if(scene_inputs.length != 0)
        {
                switch (this.NUMERO_PRESET){
                    case 0:
                    this.SCENE_ELEMENTS=2;
                    for(let k=1; k<=this.SCENE_ELEMENTS; k++)
                    {
                        let legend="";
                        k==1 ? legend = "box parameters :" : legend = "sphere parameters";
                        let scene_input_container = input_fieldset_as_HTML(scene_inputs, legend)
                        for(let i in scene_inputs)
                        {
                            scene_input_container.append(scene_inputs[i].get_as_HTML(k, shader));
                        }
                        HTML_container.append(scene_input_container);
                    }
                    break;
                    case 1:
                    this.SCENE_ELEMENTS=3;
                    for(let k=1; k<=this.SCENE_ELEMENTS; k++)
                    {
                        let legend="";
                        k==1 ? legend = "sphere 1 parameters :" 
                            : k==2 ? legend = "sphere 2 parameters"
                            : legend = "sphere 3 parameters";
                        let scene_input_container = input_fieldset_as_HTML(scene_inputs, legend)
                        for(let i in scene_inputs)
                        {
                            scene_input_container.append(scene_inputs[i].get_as_HTML(k, shader));
                        }
                        HTML_container.append(scene_input_container);
                    }
                }
            }

        if(light_inputs.length == 0 && scene_inputs == 0)
        {
            HTML_container.innerHTML = "No input detected for this shader yet.";
        }
    }

    render()
    {
        this.scene.frame_time = this.scene.clock.getDelta();
        this.scene.elapsed_time = this.scene.clock.getElapsedTime() % 1000;
    
        this.shader_list[this.current_shader].uniforms.uTime.value = this.scene.elapsed_time;
        this.scene.camera.updateMatrixWorld(true);
        this.shader_list[this.current_shader].uniforms.uCameraPosition.value.copy(this.scene.camera.position);
        this.shader_list[this.current_shader].uniforms.uCameraMatrix.value.copy(this.scene.camera.matrixWorld);
        this.scene.renderer.setRenderTarget(null);
        this.scene.renderer.render(this.scene.scene, this.scene.camera);
    }

    on_window_resize(scene, current_shader)
    {
        let SCREEN_WIDTH = window.innerWidth * 0.45;
        let SCREEN_HEIGHT = window.innerHeight * 0.9;

        scene.renderer.setPixelRatio(1);
        scene.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        current_shader.uniforms.uResolution.value.x = scene.context.drawingBufferWidth;
        current_shader.uniforms.uResolution.value.y = scene.context.drawingBufferHeight;

        scene.target.setSize(scene.context.drawingBufferWidth, scene.context.drawingBufferHeight);

        scene.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        scene.camera.updateProjectionMatrix();

        this.codeEditor.resize();
    }
}