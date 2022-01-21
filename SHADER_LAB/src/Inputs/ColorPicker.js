import Input from './Input.js'
import color_picker_as_HTML from './color_picker.jsx';

export default class colorPicker extends Input
{
    #value;
    constructor(label, name, value){
        super("color_picker",label, name);
        this.#value = value;
    }

    get_value(){
        return this.#value;
    }

    get_as_HTML(scene_element_id, current_shader)
    {
        return color_picker_as_HTML(
            current_shader,
            scene_element_id,
            super.get_name(),
            super.get_name(),
            this.#value,
            super.get_label()
        );
    }
}