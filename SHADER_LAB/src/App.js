import Scene from './Canvas/Scene.js'
import shaders_json from './shaders/shaders.json'

import init from './Canvas/init.js'
import loadShaders from './Canvas/load_shaders'
import animate from './Canvas/animate.js'
import GLOBALS from './Canvas/globals.js'

import Shader from './Canvas/Shader.js'

export class App
{
    shaders = [];

    scene = new Scene();

    constructor(){
        for (let i in shaders_json){
            this.shaders.push(new Shader(shaders_json[i]))
        }
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
