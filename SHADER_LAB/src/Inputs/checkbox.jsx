import createElement from "./createElement.js";

export default (current_shader, scene_element_id, id, name, label) => {
    const checkbox = 
    <div className="one_input_container checkbox">
        <input
        oninput = { function(){ current_shader.update(label, this.value, "checkbox", scene_element_id)}}
        type    = "checkbox"
        id      = { id }
        name    = { name }
        checked
        />
        <label htmlFor={ name }>{ label }</label>
    </div>;

    return checkbox;
}