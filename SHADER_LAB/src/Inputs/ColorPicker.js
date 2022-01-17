import Input from './Input.js'

export default class colorPicker extends Input
{
    #value;
    constructor(label, name, value){
        super("colorPicker",label, name);
        this.#value = value;
    }

    getChecked(){
        return this.#value;
    }
}