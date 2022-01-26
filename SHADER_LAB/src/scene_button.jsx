import createElement from "./Inputs/createElement.js";

export default (app, preset_id) => {
    const scene_button = 
    <button
        onclick={() => { app.update_preset(preset_id); }}
        id={ "preset_" + preset_id }
        className="preset_button scene"
    >
        {"Scene " + (preset_id+1) }
    </button>

    return scene_button;
}