import * as THREE from 'three';

export default class CodeChecker
{
    messageToDisplay;
    modeles;

    constructor(){
        this.modeles = ['main_flatPainting', 'main_lambert', 'main_phongIllumination', 'main_personal']; //ajouter celle de l'utilisateur 
    }

    check_compilation(app){
        let fs=THREE.ShaderChunk['test_compile'] + THREE.ShaderChunk['uniforms_and_defines'] + THREE.ShaderChunk['creation_scene'] + THREE.ShaderChunk['RayMarch'] + THREE.ShaderChunk['get_normal'] + THREE.ShaderChunk['rand'] + app.scene.mesh.material.fragmentShader + THREE.ShaderChunk[this.modeles[app.current_shader]]
        //console.log(fs)
        let status, log, shader, lines, error, details, i, line, message, true_error=true, warning = false;
        try{
            shader = app.scene.context.createShader(app.scene.context.FRAGMENT_SHADER);
            app.scene.context.shaderSource(shader, fs)
            app.scene.context.compileShader(shader)
            status = app.scene.context.getShaderParameter(shader, app.scene.context.COMPILE_STATUS)
        }
        catch(error1){
            e=error1;
            this.messageToDisplay = "error : "+e.getMessage
            console.log(this.messageToDisplay)
        }
        if (status === true){
            this.messageToDisplay = "shader loaded successfully"
            console.log(this.messageToDisplay)
        }
        else{
            log = app.scene.context.getShaderInfoLog(shader)
            //console.log(log)
            app.scene.context.deleteShader(shader);
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
                true_error ? this.messageToDisplay = 'unable to parse error...' : this.messageToDisplay = "shader loaded successfully"
                console.log(this.messageToDisplay)
            }
            else{
                details = error.split(':')
                if(details.length < 4){
                    this.messageToDisplay = error
                    console.log(this.messageToDisplay)
                }
                line = details[2];
                message = details.splice(3).join(':')
                this.messageToDisplay = "Line : "+parseInt(line-124)+" : "+message
                if (warning) this.messageToDisplay = "(WARNING) "+this.messageToDisplay
                console.log(this.messageToDisplay)
            }
        }
    }  
}