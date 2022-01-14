import * as THREE from 'three';
import Input from './Input.js'

export default class Shader
{
    #nom;
    #inputs;
    uniforms;
    vertex_shader;
    fragment_shader;
    constructor(nom, vertex_shader_path, fragment_shader_path, inputs){
        this.#nom = nom;
        this.#inputs = inputs;
        this.uniforms = {
            uTime: { type: "f", value: 0.0 },
            uResolution: { type: "v2", value: new THREE.Vector2() },
            uCameraPosition: { type: "v3", value: new THREE.Vector3() },
            uRotatingLight: {value: 0},

            uColors:{value : [new THREE.Color('blue'), new THREE.Color('white')]},
            uKd:{value: [0.4,0.7]},
            uKs:{value: [0.1,0.2]},
            uKa:{value: [0.9,0.4]},
            uAlpha:{value: [30, 20]}
        };
        //this.loadShaders(vertex_shader_path, fragment_shader_path);
    }

    update(name, value, id){
        if(name=="rotate_light"){
            //updateLight(value, id)
        }
        if(name=="alpha"){
            //updateAlpha(value, id)
        }
    }

}