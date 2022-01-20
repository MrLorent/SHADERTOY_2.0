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
                if(word[2] === 'scene')
                {
                    switch(word[1])
                    {
                        case "color_picker":
                            element = element.replace(element, "uniform  vec3 "+word[3]+"[N_MATERIALS];");
                            input_details = {
                                "target": word[2],
                                "type": "color_picker",
                                "label": word[4],
                                "name": word[3],
                                "value": "#000000"
                            };
                            break;
                        case "checkbox":
                            element = element.replace(element, "uniform  float "+word[3]+";");
                            input_details = {
                                "target": word[2],
                                "type": "checkbox",
                                "label": word[4],
                                "name": word[3],
                                "checked": 1
                            };
                            break;
                        case "slider":
                            element = element.replace(element, "uniform  float "+word[3]+"[N_MATERIALS];");
                            input_details = {
                                "target": word[2],
                                "type": "slider",
                                "label": word[4],
                                "name": word[3],
                                "min": word[5],
                                "max": word[6],
                                "step": word[7]
                            };
                            break;
                        default:
                            console.log("unknom input type")
                            break;
                    }
                }
                else if(word[2] === 'light')
                {
                    switch(word[1])
                    {
                        case "color_picker":
                            element = element.replace(element, "uniform  vec3 "+word[3]+";");
                            input_details = {
                                "target": word[2],
                                "type": "color_picker",
                                "label": word[4],
                                "name": word[3],
                                "value": "#000000"
                            };
                            break;
                        case "checkbox":
                            element = element.replace(element, "uniform  float "+word[3]+";");
                            input_details = {
                                "target": word[2],
                                "type": "checkbox",
                                "label": word[4],
                                "name": word[3],
                                "checked": 1
                            };
                            break;
                        case "slider":
                            element = element.replace(element, "uniform  float "+word[3]+";");
                            input_details = {
                                "target": word[2],
                                "type": "slider",
                                "label": word[4],
                                "name": word[3],
                                "min": word[5],
                                "max": word[6],
                                "step": word[7]
                            };
                            break;
                        default:
                            console.log("unknom input type")
                            break;
                    }
                }

                shader.add_input(input_details);
            }
            new_text += element + "\n";
        });

        /* substr just remove the last enter */
        return new_text.substr(0,new_text.length-1);
    }
}