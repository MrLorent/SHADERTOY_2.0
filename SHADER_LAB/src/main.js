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

    const app = new App(shader_list);

    function animate(){
        app.render()
        requestAnimationFrame(animate)
    }

    animate();
    
    //update 
    app.shader_list[app.current_shader].update("color", new THREE.Color('white'), SALLE)
    app.shader_list[app.current_shader].update("color", new THREE.Color('green'), BOX)
    app.shader_list[app.current_shader].update("rotate_light",1)
}

load_shaders(shaders_json,shaders_as_text,shaders_left);