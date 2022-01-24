import createElement from "./Inputs/createElement.js";

export default (app, preset_id) => {
    const scene_button = 
    <button
        onclick={() => { app.update_preset(preset_id); }}
        id={ "preset_button_" + preset_id }
    >{"Scene " + (preset_id+1) }</button>

    return scene_button;
}