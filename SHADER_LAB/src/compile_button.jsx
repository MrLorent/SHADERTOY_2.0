import createElement from "./Inputs/createElement.js";

export default (app) => {
    const compile_button = 
    <abbr title="Run code">
        <button
            onclick={() => { app.update_shader();}}
            id="compile_button"
        >
        </button>
    </abbr>

    return compile_button;
}