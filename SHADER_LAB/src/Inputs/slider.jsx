import createElement from "./createElement.js";

export default (current_shader, scene_element_id, id, name, min, max, step, label) => {
    const slider = 
        <div className='one_input_container slider'>
            <input
                oninput = { function(){ current_shader.update(label, this.value,"slider", scene_element_id) }}
                type    =   "range"
                id      =   { id }
                name    =   { name }
                min     =   { min }
                max     =   { max }
                step    =   { step }
            />
            <label htmlFor={ name }>{ label }</label>
        </div>

        return slider;
}