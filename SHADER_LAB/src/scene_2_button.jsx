import createElement from "./Inputs/createElement.js";

export default (app) => {
    const scene_2_button = 
    <button
        onclick={() => { app.update_preset(1); }}
        id="preset_button"
    >Scene 2</button>

    return scene_2_button;
}