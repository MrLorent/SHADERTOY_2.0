import createElement from "./Inputs/createElement.js";

export default (app) => {
    const scene_1_button = 
    <button
        onclick={() => { app.update_preset(0); }}
        id="preset_button"
    >Scene 1</button>

    return scene_1_button;
}