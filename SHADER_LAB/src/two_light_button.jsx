import createElement from "./Inputs/createElement.js";

export default (app) => {
    const two_light_button = 
    <button
    onclick={() => { app.update_light( 1); }}
        id="preset_light_button"
    >Two Light</button>

    return two_light_button;
}