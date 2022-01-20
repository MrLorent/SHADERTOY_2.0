import * as THREE from 'three';
import Input from "../Inputs/inputFactory.js";
import { CodeReader } from '../CodeEditor/CodeReader.js';

export default class Shader
{
    #name;
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
    uniform;
    uniform_color;


    constructor(shader_details,vertex, fragment)
    {
        let reader = new CodeReader();
        shader_details = shader_details[0];

        this.#name = shader_details['nom'];
        this.vertex_shader_path = shader_details['vertex'];
        this.fragment_shader_path = shader_details['fragment'];
        this.vertex_shader  = vertex;
        this.fragment_shader = reader.analyzeText(fragment, this);
        this.alpha      =   [30, 20,50];
        this.color      =   [new THREE.Color('white'), new THREE.Color('purple'),new THREE.Color('orange')];
        this.ambiant    =   [0.9,0.4,0.5];
        this.diffus     =   [0.4,0.7,0.5];
        this.specular   =   [0.1,0.2,0.3];
        this.uniform    =   []
        this.uniform_color = []
        this.uniforms   =   {
            uTime: { type: "f", value: 0.0 },
            uResolution: { type: "v2", value: new THREE.Vector2() },
            uCameraPosition: { type: "v3", value: new THREE.Vector3() },
            uRotatingLight: {value: 1},
            uColorLight : {value : new THREE.Color('white')},
            uLightPosition  : {value : new THREE.Vector3(0,5,6)},

            uColors:{value : this.color},
            uKd:{value: this.diffus},
            uKs:{value: this.specular},
            uKa:{value: this.ambiant},
            uAlpha:{value: this.alpha},

        };
        


        

    
    }

    get_name()
    {
        return this.#name;
    }

    get_inputs()
    {
        return this.#inputs;
    }

    update(name, value, type,id=0){

        if(this.#name != "Personal")
        {
            if(name=="rotate_light"){
                this.uniforms.uRotatingLight.value = value;
            }
            else if(name=="alpha"){
                this.alpha[id]=value;
                this.uniforms.uAlpha.value = this.alpha;
            }
            else if (name=="color"){
                this.color[id]= new THREE.Color(value);
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
            else if(name=="color_light"){
                this.uniforms.uColorLight = new THREE.Color(value);

            }
            else if(name=="position_light"){
                this.uniforms.uLightPosition = new THREE.Vector3(value);

            }
            

        }
        
        else if( this.#name ==="Personal")
        {
            for(let i = 0;i<this.#inputs.length;i++)
            {
                
                if(type ==="slider" & name===this.#inputs[i].get_label())
                {
                    this.uniform[i][id]=value;
                    this.uniforms[this.#inputs[i].get_name()][value] = this.uniform[i];
                }
                if(type==="checkbox" & name === this.#inputs[i].get_label())
                {
    
                    this.uniforms[this.#inputs[i].get_name()].value = value;
                    
                }
                if(type==="color_picker" & name === this.#inputs[i].get_label())
                {
                
                    this.uniform_color[i][id] = new THREE.Color(value);
                    this.uniforms[this.#inputs[i].get_name()][value] = this.uniform_color[i];
                }
                
            }
            
        }


    }

    add_input(uniform){
        
        
        this.#inputs.push(Input(uniform));
        let i = this.#inputs.length;
        console.log(this.uniforms)
        if(this.#name === "Personal")
        {
            if(this.#inputs[this.#inputs.length-1].get_type()==="slider")
            {
                this.uniform[this.#inputs.length-1] = [1.,1.,1.]
                this.uniforms[this.#inputs[this.#inputs.length-1].get_name()] = {value : this.uniform[this.#inputs.length-1]}
                
                console.log(this.uniforms)
                console.log(this.#inputs.length)
            }

            else if(this.#inputs[this.#inputs.length-1].get_type()==="checkbox")
            {
                this.uniforms[this.#inputs[this.#inputs.length-1].get_name()] = {value : 1.0}
                
                
            }
            else if (this.#inputs[this.#inputs.length-1].get_type()==="color_picker")
            {
                this.uniform_color[this.#inputs.length-1] = [new THREE.Color('white'), new THREE.Color('white'),new THREE.Color('white')];
                this.uniforms[this.#inputs[this.#inputs.length-1].get_name()] = {value : this.uniform_color[this.#inputs.length-1]}

            }
        }
        
    }

}