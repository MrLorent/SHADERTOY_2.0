export default class Input
{
    #type;
    #label;
    #name;
    constructor(type, label, name){
        if(this.constructor == Input){
            throw new TypeError('Abstract class "Input" cannot be instantiated directly');
        }
        this.#type = type;
        this.#label = label;
        this.#name = name;
    }

    getType(){
        return this.#type;
    }

    getLabel(){
        return this.#label;
    }

    getName(){
        return this.#name;
    }
}