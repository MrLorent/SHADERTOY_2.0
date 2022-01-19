import createElement from "./Inputs/createElement.js";

export default () => {
    const switch_button = 
    <button
        onclick={() => {
            document.querySelector('#interactive_window .container').classList.toggle('code_editor');
            }}
        id="switch_input_panel_button"
    >switch</button>

    return switch_button;
}