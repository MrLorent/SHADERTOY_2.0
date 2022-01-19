import Input from './Input.js'
import createElement from './createElement.js';

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
        const label = super.get_label();
        const slider = 
        <div className='input-container slider'>
            <input
                oninput = { function(){ current_shader.update(label, this.value,"slider", scene_element_id) }}
                type    =   "range"
                id      =   { super.get_name() }
                name    =   { super.get_name() }
                min     =   { this.#min }
                max     =   { this.#max }
                step    =   { this.#step }
            />
            <label htmlFor={ super.get_name() }>{ super.get_label() }</label>
        </div>

        return slider;
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