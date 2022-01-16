import vertex from './shaders/vertex/vertexShader.glsl'
import fragment_phong from './shaders/fragment/phongIllumination.glsl'
import fragment_flat from './shaders/fragment/flatPainting.glsl'
import fragment_lambert from './shaders/fragment/lambert.glsl'

import Scene from './canvas/Scene.js'
var shaders_json = require('./shaders/shaders.json')

import init from './canvas/init.js'
import loadShaders from './canvas/load_shaders'
import animate from './canvas/animate.js'
import * as GLOBALS from './canvas/globals.js'
import * as THREE from 'three';

import Input from './Canvas/Input.js';
import Slider from './Canvas/Slider.js'
import Checkbox from './Canvas/Checkbox.js'
import Shader from './Canvas/Shader.js'

export class App
{
    

    shaders = [];

    scene= new Scene();

    constructor(){
        for (let i =0; i<3; i++){
            this.shaders.push(this.createShader(i))    
        }
        console.log(this.shaders)
    }

    createShader(id){
        let inputs = [];
        let inputs_json = shaders_json['shader'+id][0]['input'];
        for(let i=0; i<inputs_json.length; i++){
            if(inputs_json[i]['type']=="checkbox"){
                inputs.push(new Checkbox(inputs_json[i]['label'], inputs_json[i]['name'], inputs_json[i]['checked']));
            }
            else if(inputs_json[i]['type']=="slider"){
                inputs.push(new Slider(inputs_json[i]['label'], inputs_json[i]['name'], inputs_json[i]['min'], inputs_json[i]['max'], inputs_json[i]['any']))
            }
            //else if color picker
        }

        return new Shader(shaders_json['shader'+id][0]['nom'], shaders_json['shader'+id][0]['vertex'], shaders_json['shader'+id][0]['fragment'], inputs)
    }


    run(id)
    {
        loadShaders(id, this.scene, this.shaders, shaders_json)
        init(this.scene, this.shaders[id]);
        GLOBALS.currentScene = this.scene;
        GLOBALS.currentShader=this.shaders[id];

        animate();
    }
}
