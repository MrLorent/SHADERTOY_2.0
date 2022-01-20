import Input from './Input.js'
import checkbox_as_HTML from './checkbox.jsx';

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
        return checkbox_as_HTML(
            current_shader,
            scene_element_id,
            super.get_name(),
            super.get_name(),
            super.get_label()
        );
    }
}