import createElement from "./Inputs/createElement.js";

export default (shaders_name, shaders_id, app) => {
    const nav_bar = 
    <nav>
        <ul id="shader_list">
            {shaders_name.map(name => (
                <li
                onclick = {function(){ 
                    app.switch_shader(shaders_id[name]);
                    app.update_preset(app.NUMERO_PRESET);
                    
                    let previous = document.querySelector('.shader_link.current');
                    previous.classList.remove('current');
                    this.classList.add('current');
                }}
                className={shaders_id[name] == 0 ? "shader_link current" : "shader_link"}
                >{ name }</li>
            ))}
        </ul>
    </nav>;

    return nav_bar;
}