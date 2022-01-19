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
    //count_uniform;
    count_check;


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
        this.color      =   [new THREE.Color('blue'), new THREE.Color('white'),new THREE.Color('orange')];
        this.ambiant    =   [0.9,0.4,0.5];
        this.diffus     =   [0.4,0.7,0.5];
        this.specular   =   [0.1,0.2,0.3];
        this.uniform    =   []
        this.uniform_color = []
        //this.count_uniform = 0;
        this.count_check =0;
        this.uniforms   =   {
            uTime: { type: "f", value: 0.0 },
            uResolution: { type: "v2", value: new THREE.Vector2() },
            uCameraPosition: { type: "v3", value: new THREE.Vector3() },
            uRotatingLight: {value: 1},

            uColors:{value : this.color},
            uKd:{value: this.diffus},
            uKs:{value: this.specular},
            uKa:{value: this.ambiant},
            uAlpha:{value: this.alpha},

        };

        // INPUT INSTANCIATION
        // for(let i in shader_details['inputs']){
        //     this.#inputs.push(Input(shader_details['inputs'][i]));
        // }
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

        let update = false;
        if(name=="rotate_light"){
            this.uniforms.uRotatingLight.value = value;
            update = true;
        }
        else if(name=="alpha"){
            this.alpha[id]=value;
            this.uniforms.uAlpha.value = this.alpha;
            update = true;
        }
        else if (name=="color"){
            this.color[id]= new THREE.Color(value);
            this.uniforms.uColors.value = this.color;
            update = true;

        }
        else if(name=="ambiant"){
            this.ambiant[id]=value;
            this.uniforms.uKa.value = this.ambiant;
            update = true;

        }
        else if(name=="diffus"){
            this.diffus[id]=value;
            this.uniforms.uKd.value = this.diffus;
            update = true;

        }
        else if(name=="specular"){
            this.specular[id]=value;
            this.uniforms.uKs.value = this.specular;
            update = true;

        }
        
        else if( this.#name ==="Personal" & update === false)
        {
            for(let i = 0;i<this.#inputs.length;i++)
            {
                
                if(type ==="slider" & name===this.#inputs[i].get_label())
                {
                    this.uniform[i][id]=value;
                    //console.log(this.uniforms[this.#inputs[i].get_name()].value)
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
        console.log(this.#inputs)
        if(this.#name ==="Personal" & this.#inputs[this.#inputs.length-1].get_type()==="slider")
        {
            this.uniform[this.#inputs.length-1] = [1.,1.,1.]
            this.uniforms[this.#inputs[this.#inputs.length-1].get_name()] = {value : this.uniform[this.#inputs.length-1]}
            
            console.log(this.uniforms)
            //this.count_uniform ++;
            console.log(this.#inputs.length)
            //this.update(this.#inputs[this.#inputs.length-1].get_name(),1,1);
        }

        else if(this.#name ==="Personal" & this.#inputs[this.#inputs.length-1].get_type()==="checkbox")
        {
            //this.uniform_check[i-1] = 1.0
            this.uniforms[this.#inputs[this.#inputs.length-1].get_name()] = {value : 1.0}
            
            console.log(this.uniforms)
            //this.count_check ++;
            console.log(this.#inputs.length)
            console.log(this.uniforms)
            

            //this.update(this.#inputs[this.#inputs.length-1].get_label(),0,"checkbox");
            
        }
        else if (this.#name ==="Personal" & this.#inputs[this.#inputs.length-1].get_type()==="color_picker")
        {
            console.log(this.uniforms)
            this.uniform_color[this.#inputs.length-1] = [new THREE.Color('white'), new THREE.Color('white'),new THREE.Color('white')];
            this.uniforms[this.#inputs[this.#inputs.length-1].get_name()] = {value : this.uniform_color[this.#inputs.length-1]}
            console.log(this.uniforms)


        }
        
        
    }

}