import Input from './Input.js'

export default class Checkbox extends Input
{
    #checked;
    constructor(label, name, checked){
        super("checkbox",label, name);
        this.#checked=checked;
    }

    getChecked(){
        return this.#checked;
    }
}