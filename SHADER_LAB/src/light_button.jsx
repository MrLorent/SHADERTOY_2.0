import createElement from "./Inputs/createElement.js";

export default (app, light_preset_id) => {
    const light_button = 
    <button
        onclick={() => { app.update_light( light_preset_id ); }}
        className="preset_button light"
        id = { "preset_light_" + light_preset_id }
    >
        {"Light preset "+ (light_preset_id + 1)}
    </button>

    return light_button;
}