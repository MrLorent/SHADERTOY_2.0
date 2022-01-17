export class CodeReader
{
    constructor(){

    }

    analyzeText(shader_text){
        let new_text;
        const line = shader_text.split("\n");
        line.forEach(element => {
            let word=element.split(" ");
            if(word[0] == "///"){
                element=element.replace(element, "uniform "+word[1]+" "+word[2]+";");
                word.splice(0,1);
                word.pop();
                //On envoie word 1(type), 2(name),3(label),4(input),5(min),7(max) slider
                //On envoie word 1(type), 2(name),3(label),4(input),5(isChecked) checkbox
                console.log(JSON.stringify(word));
                //shader_text.add_input(JSON.stringify(word))
            }
            new_text+=element+"\n";
        });
        return new_text;
    }
}