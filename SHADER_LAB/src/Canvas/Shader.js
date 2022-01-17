import * as THREE from 'three';
import input_factory from "../Inputs/inputFactory.js";

export default class Shader
{
    #nom;
    #inputs = [];
    uniforms;
    vertex_shader_path;
    fragment_shader_path
    vertex_shader;
    fragment_shader;
    alpha = [];
    color=[];
    ambiant=[];
    diffus=[];
    specular=[];

    // constructor(nom, vertex_shader_path, fragment_shader_path, inputs){
    //     this.#nom = nom;
    //     this.#inputs = inputs;
    //     this.alpha = [30, 20,50];
    //     this.color=[new THREE.Color('blue'), new THREE.Color('white'),new THREE.Color('orange')];
    //     this.ambiant=[0.9,0.4,0.5];
    //     this.diffus=[0.4,0.7,0.5];
    //     this.specular=[0.1,0.2,0.3];
    //     this.uniforms = {
    //         uTime: { type: "f", value: 0.0 },
    //         uResolution: { type: "v2", value: new THREE.Vector2() },
    //         uCameraPosition: { type: "v3", value: new THREE.Vector3() },
    //         uRotatingLight: {value: 0},

    //         uColors:{value : this.color},
    //         uKd:{value: this.diffus},
    //         uKs:{value: this.specular},
    //         uKa:{value: this.ambiant},
    //         uAlpha:{value: this.alpha}
    //     };
    //     //this.loadShaders(vertex_shader_path, fragment_shader_path);
    // }

    constructor(shader_details,vertex, fragment)
    {
        shader_details = shader_details[0];

        this.#nom = shader_details['nom'];
        this.vertex_shader_path = shader_details['vertex'];
        this.fragment_shader_path = shader_details['fragment'];
        this.vertex_shader  = vertex;
        this.fragment_shader = fragment;
        this.alpha      =   [30, 20,50];
        this.color      =   [new THREE.Color('blue'), new THREE.Color('white'),new THREE.Color('orange')];
        this.ambiant    =   [0.9,0.4,0.5];
        this.diffus     =   [0.4,0.7,0.5];
        this.specular   =   [0.1,0.2,0.3];
        this.uniforms   =   {
            uTime: { type: "f", value: 0.0 },
            uResolution: { type: "v2", value: new THREE.Vector2() },
            uCameraPosition: { type: "v3", value: new THREE.Vector3() },
            uRotatingLight: {value: 0},

            uColors:{value : this.color},
            uKd:{value: this.diffus},
            uKs:{value: this.specular},
            uKa:{value: this.ambiant},
            uAlpha:{value: this.alpha}
        };

        // INPUT INSTANCIATION
        for(let i in shader_details['inputs']){
            this.#inputs.push(input_factory(shader_details['inputs'][i]));
            //console.log(this.#inputs);
        }

        
    }

    update(name, value, id=0){
        if(name=="rotate_light"){
            this.uniforms.uRotatingLight.value = value;
        }
        else if(name=="alpha"){
            this.alpha[id]=value;
            this.uniforms.uAlpha.value = this.alpha;
        }
        else if (name=="color"){
            this.color[id]=value;
            this.uniforms.uColors.value = this.color;

        }
        else if(name=="ambiant"){
            this.ambiant[id]=value;
            this.uniforms.uKa.value = this.ambiant;

        }
        else if(name=="diffus"){
            this.diffus[id]=value;
            this.uniforms.uKd.value = this.diffus;

        }
        else if(name=="specular"){
            this.specular[id]=value;
            this.uniforms.uKs.value = this.specular;

        }
    }

    add_input(uniform){
        
    }

}