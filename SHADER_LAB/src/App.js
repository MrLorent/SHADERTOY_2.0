import Scene from './Canvas/Scene.js'
import Shader from './Canvas/Shader.js'
import shaders_json from './shaders/shaders.json'

import init from './Canvas/init.js'
import loadShaders from './Canvas/load_shaders'
import animate from './Canvas/animate.js'
import GLOBALS from './Canvas/globals.js'

export class App
{
    scene;
    list_of_shaders;

    constructor(){
        // CREATING SCENE
        this.scene = new Scene();
        
        // LOADING SHADERS
        this.list_of_shaders = [];
        for (let i in shaders_json){
            this.list_of_shaders.push(new Shader(shaders_json[i]))
        }
    }

    run(id)
    {
        loadShaders(id, this.scene, this.list_of_shaders, shaders_json)
        init(this.scene, this.list_of_shaders[id]);
        GLOBALS.currentScene = this.scene;
        GLOBALS.currentShader=this.list_of_shaders[id];

        animate();
    }
}
