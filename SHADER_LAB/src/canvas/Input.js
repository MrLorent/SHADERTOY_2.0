export default class Input
{
    constructor(label, name, type){
        if(this.constructor == Input){
            throw new TypeError('Abstract class "Input" cannot be instantiated directly');
        }
        this.label = label;
        this.name = name;
        //this.type = type;
    }
}