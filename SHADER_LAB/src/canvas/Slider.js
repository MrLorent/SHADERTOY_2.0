import Input from './Input.js'

export default class Slider extends Input
{
    constructor(label, name, min, max, step){
        super(label, name);
        this.min = min;
        this.max = max;
        this.step = step;
    }
}