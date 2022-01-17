import './scss/index.scss';

import { App } from './App.js'
import slider_as_HTML from './Inputs/html_generators/slider.jsx';
import { CodeEditor } from './CodeEditor/CodeEditor.js';
import * as THREE from 'three';
import { CodeReader, codeChecker } from './CodeEditor/CodeReader.js';
import shaders_json from './shaders/shaders.json'
import Shader from './Canvas/Shader';

let SALLE = 0
let BOX = 1;
let SPHERE = 2;

let shaders_as_text = [];
let list_of_shaders = [];
let shaders_left = Object.keys(shaders_json).length;


async function loadShader(shaders_json,shaders_as_text,shaders_left)
{
    if(shaders_left ===0)
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
        loadShader(shaders_json,shaders_as_text,shaders_left-1);
    }

}



function launch_App(shaders_as_text)
{
    //creation of list_of_shaders
    for ( let i = 1; i<shaders_as_text.length  ; i++)
    {
        list_of_shaders[i-1] = new Shader(shaders_json[i-1],shaders_as_text[0],shaders_as_text[i]);
    }

    const app = new App(list_of_shaders);

    function animate(){
    app.run()
    requestAnimationFrame(animate)
    }

    animate();
    
    //update 
    app.list_of_shaders[app.current_shader].update("color", new THREE.Color('white'), SALLE)
    app.list_of_shaders[app.current_shader].update("color", new THREE.Color('green'), BOX)
    app.list_of_shaders[app.current_shader].update("rotate_light",1)

    console.log(app.scene.mesh.material.vertexShader)

    let status, log, shader, lines, error, details, i, line, message;
    let messageToDisplay;
    try{
        shader = app.scene.context.createShader(app.scene.context.VERTEX_SHADER);
        app.scene.context.shaderSource(shader, app.scene.mesh.material.vertexShader)
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
        console.log(log)
        // ? app.scene.context.deleteShader(shader);
        lines = log.split('\n');
        for(let j =0, len = lines.length; j <len; j++){
            i = lines[j]
            if(i.substr(0,5) === 'ERROR'){
                error = i
                break;
            }
        }
        if(!error){
            messageToDisplay = 'unable to parse error...'
            console.log(messageToDisplay)
        }
        details = error.split(':')
        if(details.length < 4){
            messageToDisplay = error
            console.log(messageToDisplay)
        }
        line = details[2];
        message = details.splice(3).join(':')
        messageToDisplay = "Line : "+parseInt(line)+" : "+message
        console.log(messageToDisplay)
    }
    
}

loadShader(shaders_json,shaders_as_text,shaders_left);



// Inputs
const inputs = document.getElementById('inputs');

const tmp = slider_as_HTML(1, "Alpha", "input1", 1, 100);

inputs.append(tmp);

// GLSLCodeEditor
const codeEditor = new CodeEditor('glsl-editor');
const codeReader = new CodeReader();
codeEditor.getEditor().setValue(codeReader.analyzeText(codeEditor.getEditor().getValue()));