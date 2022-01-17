export class CodeReader
{
    constructor(){

    }

    analyzeText(shader_text, shader){
        let new_text;
        const line = shader_text.split("\n");
        line.forEach(element => {
            let word=element.split(" ");
            if(word[0] == "///"){
                element=element.replace(element, "uniform "+word[1]+" "+word[2]+";");
                word.splice(0,1);
                word.pop();
                //On envoie word  0(name),1(label),2(min),3(max), 4(step)
                shader.add_personal_input(JSON.parse(JSON.stringify(word))) ;
            }
            new_text+=element+"\n";
        });
        return new_text;
    }
}