import createElement from "./Inputs/createElement.js";

export default (app) => {
    const compile_button = 
    <button
        onclick={() => { app.update_shader();}}
        id="compile_button"
    >
    </button>
    
    return compile_button;
}