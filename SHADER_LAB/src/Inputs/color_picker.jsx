import createElement from "./createElement.js";

export default (current_shader, scene_element_id, id, name, value, label) => {
    const color_picker = 
        <div className="one_input_container color-picker">
            <input
            oninput = { function(){ current_shader.update(label, this.value, "color_picker", scene_element_id); }}
            type    = "color"
            id      = { id }
            name    = { name }
            value   = { value }
            />
            {/* <label htmlFor={ name }>{ label }</label> */}
        </div>

    return color_picker;
}