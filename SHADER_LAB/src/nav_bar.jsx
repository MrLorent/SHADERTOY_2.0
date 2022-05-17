import createElement from "./Inputs/createElement.js";

export default (shaders_name, shaders_id, app) => {
    const nav_bar = 
    <ul className="list_of_shaders">
        {shaders_name.map(name => (
            <li
            onclick = {function(){ 
                app.switch_shader(shaders_id[name]);
                app.update_preset(app.NUMERO_PRESET);
            }}
            className="shader_link nav_link"
            >{ name }</li>
        ))}
    </ul>;

    return nav_bar;
}