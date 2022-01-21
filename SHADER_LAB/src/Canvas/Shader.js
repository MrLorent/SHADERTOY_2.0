import * as THREE from 'three';
import Input from "../Inputs/inputFactory.js";

export default class Shader
{
    #name;
    #inputs = [];
    vertex_shader_path;
    fragment_shader_path;
    uniforms;
    vertex_shader;
    fragment_shader;
    shininess = [];
    color=[];
    ambiant=[];
    diffus=[];
    specular=[];
    subsurface=[];
    metallic=[];
    specularTint=[];
    roughness=[];
    anisotropic=[];
    sheen=[];
    sheenTint=[];
    clearcoat=[];
    clearcoatGloss=[];
    
    uniform;
    uniform_color;
    #material;


    constructor(shader_details, vertex, fragment)
    {
        shader_details = shader_details[0];
        this.#name = shader_details['nom'];
        this.#inputs['light'] = [[],[]];
        this.#inputs['scene'] = [];
        this.vertex_shader_path = shader_details['vertex'];
        this.fragment_shader_path = shader_details['fragment'];
        this.vertex_shader  = vertex;
        this.fragment_shader = fragment;
        this.shininess      =   [30, 20,50,50,50,50, 50,50];
        this.color      =   [new THREE.Color('white'), new THREE.Color('purple'),new THREE.Color('orange'), new THREE.Color('green'), new THREE.Color('aqua'), new THREE.Color('pink'), new THREE.Color('Light coral', new THREE.Color('#9370DB'))];
        this.ambiant    =   [0.9,0.4,0.5,1,1,1,1,1];
        this.diffus     =   [0.4,0.7,0.5,1,1,1,1,1];
        this.specular   =   [0.1,0.2,0.3,1,1,1,1,1];
        this.subsurface = [0,0.1,1,0.5,0,0.1,1,0.5]
        this.metallic   = [0,0.1,1,0.5,0,0.1,1,0.5];
        this.specularTint = [0,0.1,1,0.5,0,0.1,1,0.5];
        this.roughness= [1,0.1,1,0.5,0,0.1,1,0.5];
        this.anisotropic= [0,0.1,1,0.5,0,0.1,1,0.5];
        this.sheen= [0,0.1,1,0.5,0,0.1,1,0.5];
        this.sheenTint= [0,0.1,1,0.5,0,0.1,1,0.5];
        this.clearcoat= [0,0.1,1,0.5,0,0.1,1,0.5];
        this.clearcoatGloss= [0,0.1,1,0.5,0,0.1,1,0.5];

        this.uniform    =   []
        this.uniform_color = []
        this.uniforms   =   {
            uTime: { type: "f", value: 0.0 },
            uResolution: { type: "v2", value: new THREE.Vector2() },
            uCameraPosition: { type: "v3", value: new THREE.Vector3() },
            uRotatingLight: {value: 1},
            uColorLight : {value : new THREE.Color('white')},
            uLightPositionX  : {value : -10},
            uLightPositionY  : {value : 10},
            uLightPositionZ  : {value : -2},
            uColorLight2 : {value : new THREE.Color('green')},
            uLightPositionX2  : {value : 10},
            uLightPositionY2  : {value : 10},
            uLightPositionZ2  : {value : -2},
            uSecond_Light_on_off : {value : 0},
            uCameraMatrix:{value : new THREE.Matrix4()},

            uColors:{value : this.color},
            uKd:{value: this.diffus},
            uKs:{value: this.specular},
            uKa:{value: this.ambiant},
            uShininess:{value: this.shininess},
        };
    }

    get_name()
    {
        return this.#name;
    }

    get_light_inputs()
    {
        if(this.uniforms.uSecond_Light_on_off.value === 0)
        {
            return this.#inputs['light'][0];
        }
        else{
            return this.#inputs['light'][1];
        }
        
    }

    get_scene_inputs()
    {
        return this.#inputs['scene']
    }

    get_material()
    {
        return this.#material;
    }

    set_fragment_shader(fragment_shader_text)
    {
        this.fragment_shader = fragment_shader_text;
    }

    init_material()
    {
        this.#material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertex_shader,
            fragmentShader: this.fragment_shader,
            depthTest: false,
            depthWrite: false
        });
    }

    update_material()
    {
        this.#material.fragmentShader = this.fragment_shader;
        this.#material.needsUpdate = true;
    }

    update(name, value, type, id=0){

        if(this.#name != "Personal")
        {
            if(name=="rotate_light"){
                this.uniforms.uRotatingLight.value == 1 ? this.uniforms.uRotatingLight.value = 0 : this.uniforms.uRotatingLight.value = 1;
            }
            else if(name=="shininess"){
                this.shininess[id]=value;
                this.uniforms.uShininess.value = this.shininess;
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
                this.uniforms.uColorLight.value = new THREE.Color(value);

            }
            else if(name=="positionX_light"){
                this.uniforms.uLightPositionX.value = value;

            }
            else if(name=="positionY_light"){
                this.uniforms.uLightPositionY.value = value;

            }
            else if(name=="positionZ_light"){
                this.uniforms.uLightPositionZ.value = value;

            }
            else if(name=="color_light2"){
                this.uniforms.uColorLight2.value = new THREE.Color(value);

            }
            else if(name=="positionX_light2"){
                this.uniforms.uLightPositionX2.value = value;

            }
            else if(name=="positionY_light2"){
                this.uniforms.uLightPositionY2.value = value;

            }
            else if(name=="positionZ_light2"){
                this.uniforms.uLightPositionZ2.value = value;

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
        if(uniform.target === "scene")
        {
            this.#inputs[uniform.target].push(Input(uniform));
            let i = this.#inputs[uniform.target].length-1;
            if(this.#name === "Personal")
            {
                if(this.#inputs[uniform.target][i].get_type() === "slider")
                {
                    this.uniform[i] = [1.,1.,1.]
                    this.uniforms[this.#inputs[uniform.target][i].get_name()] = {value : this.uniform[i]}
                }

                else if(this.#inputs[uniform.target][i].get_type() === "checkbox")
                {
                    this.uniforms[this.#inputs[uniform.target][i].get_name()] = {value : 1.0}
                    
                    
                }
                else if (this.#inputs[uniform.target][i].get_type() === "color_picker")
                {
                    this.uniform_color[i] = [new THREE.Color('white'), new THREE.Color('white'),new THREE.Color('white')];
                    this.uniforms[this.#inputs[uniform.target][i].get_name()] = {value : this.uniform_color[i]}

                }
            }
        }
        else if (uniform.label != "preset")
        {
            
            this.#inputs[uniform.target][1].push(Input(uniform)); 
            let i = this.#inputs[uniform.target][1].length-1;

            if(this.#name === "Personal")
            {
                this.#inputs[uniform.target][0].push(Input(uniform)); 

                let i = this.#inputs[uniform.target][1].length-1;
                
                if(this.#inputs[uniform.target][1][i].get_type() === "slider")
                {
                    this.uniform[i] = [1.,1.,1.]
                    this.uniforms[this.#inputs[uniform.target][1][i].get_name()] = {value : this.uniform[i]}
                    this.uniforms[this.#inputs[uniform.target][0][i].get_name()] = {value : this.uniform[i]}

                }

                else if(this.#inputs[uniform.target][1][i].get_type() === "checkbox")
                {
                    this.uniforms[this.#inputs[uniform.target][1][i].get_name()] = {value : 1.0}
                    this.uniforms[this.#inputs[uniform.target][0][i].get_name()] = {value : 1.0}


                    
                }
                else if (this.#inputs[uniform.target][1][i].get_type() === "color_picker")
                {
                    this.uniform_color[i] = [new THREE.Color('white'), new THREE.Color('white'),new THREE.Color('white')];
                    this.uniforms[this.#inputs[uniform.target][1][i].get_name()] = {value : this.uniform_color[i]}
                    this.uniforms[this.#inputs[uniform.target][0][i].get_name()] = {value : this.uniform_color[i]}



                }
            }  
        
            if(this.#name != "Personal" & uniform.label != "color_light2" & uniform.label != "positionX_light2" & uniform.label != "positionY_light2"& uniform.label != "positionZ_light2")
            {
                this.#inputs[uniform.target][0].push(Input(uniform));
                let i = this.#inputs[uniform.target][0].length-1;
                
                
            }
        }
        
    }
}