import createElement from "./Inputs/createElement.js";

export default (shaders_name, shaders_id, app) => {
    const nav_bar = 
    <nav>
        <ul id="shader_list">
            {shaders_name.map(name => (
                <li
                onclick = {() => { app.init_shader(shaders_id[name]);}}
                className="shader_link"
                >{ name }</li>
            ))}
        </ul>
    </nav>;

    return nav_bar;
}