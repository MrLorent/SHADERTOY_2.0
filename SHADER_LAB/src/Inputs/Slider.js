import Input from './Input.js'
import slider_as_HTML from './html_generators/slider.jsx';

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

    get_min(){
        return this.#min;
    }

    get_max(){
        return this.#max;
    }

    get_step(){
        return this.#step;
    }

    get_as_HTML()
    {
        return slider_as_HTML(
            this.name,
            this.label,
            this.name,
            this.#min,
            this.#max,
            this.#step
        );
    }
    
    set_min(min){
        this.#min=min;
    }

    set_max(max){
        this.#max=max;
    }

    set_step(step){
        this.#step=step;
    }
}