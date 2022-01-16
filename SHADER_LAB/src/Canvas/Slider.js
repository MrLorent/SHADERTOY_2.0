import Input from './Input.js'

export default class Slider extends Input
{
    #min;
    #max;
    #step;
    constructor(label, name, min, max, step){
        super("slider",label, name);
        this.#min = min;
        this.#max = max;
        this.#step = step;
    }

    getMin(){
        return this.#min;
    }

    getMax(){
        return this.#max;
    }

    getStep(){
        return this.#step;
    }
}