import './scss/index.scss';

import { App } from './App.js';
import * as THREE from 'three';
import shaders_json from './shaders/shaders.json'
import Shader from './Canvas/Shader';

let SALLE = 0
let BOX = 1;
let SPHERE = 2;

let shaders_as_text = [];
let shader_list = [];
let shaders_left = Object.keys(shaders_json).length;

async function load_shaders(shaders_json,shaders_as_text,shaders_left)
{
    if(shaders_left === 0)
    {
        //load vertex shader 
        let response = await fetch(shaders_json[0][0]['vertex']);
        shaders_as_text[shaders_left] = await response.text();


        launch_App(shaders_as_text);
    }
    else 
    {
        //load fragment shaders
        let response = await fetch(shaders_json[shaders_left-1][0]['fragment']);
        shaders_as_text[shaders_left] = await response.text();
        load_shaders(shaders_json,shaders_as_text,shaders_left-1);
    }

}

function launch_App(shaders_as_text)
{
    //creation of shader_list
    for ( let i = 1; i < shaders_as_text.length  ; i++)
    {
        shader_list[i-1] = new Shader(shaders_json[i-1],shaders_as_text[0],shaders_as_text[i]);
    }
    //console.log(shaders_as_text[3])
    

    const app = new App(shader_list);

    //console.log(app.shader_list[2].fragment_shader)

    function animate(){
        app.render()
        requestAnimationFrame(animate)
    }

    animate();

    let modeles = ['main_flatPainting', 'main_lambert', 'main_phongIllumination'] //ajouter celle de l'utilisateur 
    let fs = THREE.ShaderChunk['test_compile'] + THREE.ShaderChunk['uniforms_and_defines'] + THREE.ShaderChunk['creation_scene'] + THREE.ShaderChunk['RayMarch'] + THREE.ShaderChunk['get_normal'] + THREE.ShaderChunk['rand'] +  app.scene.mesh.material.fragmentShader + THREE.ShaderChunk[modeles[app.current_shader]]

    let status, log, shader, lines, error, details, i, line, message, true_error=true, warning = false;
    let messageToDisplay;
    try{
        shader = app.scene.context.createShader(app.scene.context.FRAGMENT_SHADER);
        app.scene.context.shaderSource(shader, fs)
        app.scene.context.compileShader(shader)
        status = app.scene.context.getShaderParameter(shader, app.scene.context.COMPILE_STATUS)
    }
    catch(error1){
        e=error1;
        messageToDisplay = "error : "+e.getMessage
        console.log(messageToDisplay)
    }
    if (status === true){
        messageToDisplay = "shader loaded successfully"
        console.log(messageToDisplay)
    }
    else{
        log = app.scene.context.getShaderInfoLog(shader)
        //console.log(log)
        app.scene.context.deleteShader(shader);
        lines = log.split('\n');
        for(let j =0, len = lines.length; j <len; j++){
            i = lines[j]
            if(i.includes('ERROR') || i.includes('WARNING')){
                true_error=false
                if(!i.includes('invalid directive name')){
                    if (i.includes('WARNING')) warning=true;
                    error = i
                    break;
                }
            }
        }
        if(!error){
            true_error ? messageToDisplay = 'unable to parse error...' : messageToDisplay = "shader loaded successfully"
            console.log(messageToDisplay)
        }
        else{
            details = error.split(':')
            if(details.length < 4){
                messageToDisplay = error
                console.log(messageToDisplay)
            }
            line = details[2];
            message = details.splice(3).join(':')
            messageToDisplay = "Line : "+parseInt(line)+" : "+message
            if (warning) messageToDisplay = "(WARNING) "+messageToDisplay
            console.log(messageToDisplay)
        }
    }
    
}


    //this.codeEditor.getEditor().setValue(this.codeReader.analyzeText(this.codeEditor.getEditor().getValue(), this.shader_list[this.current_shader]));
    // app.shader_list[app.current_shader].fragment_shader = app.codeEditor.get_editor().getValue();
    // console.log(app.shader_list[app.current_shader].fragment_shader)


load_shaders(shaders_json,shaders_as_text,shaders_left);