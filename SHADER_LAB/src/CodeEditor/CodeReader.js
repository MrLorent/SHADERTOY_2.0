export class CodeReader
{
    constructor(){

    }

    analyzeText(shader_text, shader){
        let input_details;
        let new_text = "";
        const line = shader_text.split("\n");
        line.forEach(element => {
            let word=element.split(" ");
            if(word[0] == "///"){
                switch(word[1])
                {
                    case "color_picker":
                        element = element.replace(element, "uniform  vec3 "+word[2]+"[N_MATERIALS];");
                        input_details = {
                            "type": word[1],
                            "label": word[3],
                            "name": word[2],
                            "value": "#000000"
                        };
                        break;
                    case "checkbox":
                        element = element.replace(element, "uniform  float "+word[2]+";");
                        input_details = {
                            "type": word[1],
                            "label": word[3],
                            "name": word[2],
                            "checked": 1
                        };
                        break;
                    case "slider":
                        element = element.replace(element, "uniform  float "+word[2]+"[N_MATERIALS];");
                        input_details = {
                            "type": word[1],
                            "label": word[3],
                            "name": word[2],
                            "min": word[4],
                            "max": word[5],
                            "step": word[6]
                        };
                        break;
                    default:
                        console.log("unknom input type")
                        break;
                }
                shader.add_input(input_details);
            }
            new_text += element + "\n";
        });
        
        return new_text;
    }
}