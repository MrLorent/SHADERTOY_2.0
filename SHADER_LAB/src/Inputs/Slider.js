import Input from './Input.js'
import slider_as_HTML from './slider.jsx';

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

    get_as_HTML(scene_element_id, current_shader)
    {
        return slider_as_HTML(
            current_shader,
            scene_element_id,
            super.get_name(),
            super.get_name(),
            this.#min,
            this.#max,
            this.#step,
            super.get_label()
        );
    }
}