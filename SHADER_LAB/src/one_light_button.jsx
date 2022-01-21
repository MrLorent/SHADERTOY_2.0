import createElement from "./Inputs/createElement.js";

export default (app) => {
    const one_light_button = 
    <button
        onclick={() => { app.update_light( 0 ); }}
        id="preset_light_button"
    >One Light</button>

    return one_light_button;
}