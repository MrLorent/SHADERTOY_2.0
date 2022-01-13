import Input from './Input.js'

export default class Checkbox extends Input
{
    constructor(label, name, bool_trigger){
        super(label, name);
        this.bool_trigger=bool_trigger;
    }
}