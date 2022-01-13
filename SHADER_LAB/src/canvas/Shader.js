import Input from './Input.js'

export default class Shader
{
    constructor(nom, vertex_shader, fragment_shader, inputs){
        this.nom = nom;
        this.vertex_shader = vertex_shader;
        this.fragment_shader = fragment_shader;
        this.inputs = inputs;

        console.log(this)
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