import * as THREE from 'three';

export class CodeChecker
{
    modeles;

    constructor(){
        this.modeles = ['main_flatPainting', 'main_lambert', 'main_phongIllumination']; //ajouter celle de l'utilisateur 
    }

    check_compilation(scene, shader_text, numero_preset){
        let message_to_display = "";
        let context = scene.context;
        let creation_scene = "creation_scene_"+numero_preset
        let fs = THREE.ShaderChunk['test_compile'] + THREE.ShaderChunk['uniforms_and_defines'] + THREE.ShaderChunk[creation_scene] + THREE.ShaderChunk['RayMarch'] + THREE.ShaderChunk['get_normal'] + THREE.ShaderChunk['rand'] + shader_text + THREE.ShaderChunk['main'];
        //console.log(fs)
        let status, log, shader, lines, error, details, i, line, message, true_error=true, warning = false;
        try{
            shader = context.createShader(context.FRAGMENT_SHADER);
            context.shaderSource(shader, fs)
            context.compileShader(shader)
            status = context.getShaderParameter(shader, context.COMPILE_STATUS)
        }
        catch(error1){
            e=error1;
            message_to_display = "error : "+e.getMessage
            return {compilation_state:false, message: message_to_display};
        }
        if (status === true){
            message_to_display = "shader loaded successfully"
            return {compilation_state:true, message: message_to_display};
        }
        else{
            log = context.getShaderInfoLog(shader)
            //console.log(log)
            context.deleteShader(shader);
            lines = log.split('\n');
            for(let j =0, len = lines.length; j <len; j++){
                i = lines[j]
                if(i.includes('ERROR') || i.includes('WARNING')){
                    true_error=false
                    if(!i.includes('invalid directive name')){
                        if (i.includes('WARNING')) warning=true;
                        error = i
                        break;
                    }
                }
            }
            if(!error){
                if(true_error){
                    message_to_display = 'unable to parse error...';
                    return {compilation_state:false, message: message_to_display};
                }else{
                    message_to_display = "shader loaded successfully";
                    return {compilation_state:true, message: message_to_display};
                }
                
            }
            else
            {
                details = error.split(':')
                if(details.length < 4){
                    message_to_display = error
                    return {compilation_state:false, message: message_to_display};
                }
                line = details[2];
                message = details.splice(3).join(':')
                message_to_display = "Line : "+parseInt(line-118)+" : "+message
                
                if (warning) message_to_display = "(WARNING) "+message_to_display
                return {compilation_state:false, message: message_to_display};
            }
        }
    }  
}