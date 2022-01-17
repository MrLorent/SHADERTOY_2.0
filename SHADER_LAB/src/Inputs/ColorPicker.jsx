import Input from './Input.js'
import createElement from './createElement.js';

export default class colorPicker extends Input
{
    #value;
    constructor(label, name, value){
        super("colorPicker",label, name);
        this.#value = value;
    }

    get_value(){
        return this.#value;
    }

    get_as_HTML(scene_element_id, current_shader)
    {
        const name = super.get_name();
        const colorPicker = 
        <div className="input-container color-picker">
            <input
            oninput = { function(){ current_shader.update(name, this.value, scene_element_id); }}
            type    = "color"
            id      = { super.get_name() }
            name    = { super.get_name() }
            value   = { this.#value }
            />
            <label htmlFor={ super.get_name() }>{ super.get_label() }</label>
        </div>

        return colorPicker
    }
}