import Input from './Input.js'
import createElement from './createElement.js';

export default class Checkbox extends Input
{
    #checked;
    constructor(label, name, checked){
        super("checkbox",label, name);
        this.#checked = checked;
    }

    get_checked(){
        return this.#checked;
    }

    get_as_HTML(scene_element_id, current_shader)
    {
        const label = super.get_label();
        const checkbox = 
        <div className="input-container checkbox">
            <input
            oninput = { function(){ current_shader.update(label, this.value, "checkbox", scene_element_id)}}
            type    = "checkbox"
            id      = { super.get_name() }
            name    = { super.get_name() }
            checked
            />
            <label htmlFor={ super.get_name() }>{ super.get_label() }</label>
        </div>;
    
        return checkbox;
    }
}