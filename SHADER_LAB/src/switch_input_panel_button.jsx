import createElement from "./Inputs/createElement.js";

export default () => {
    const switch_button = 
    <abbr 
        title="Code editor"
        onclick={function(){
            document.querySelector('#interactive_window .container').classList.toggle('code_editor');
            this.title === "Code editor" ? this.title = "Interactive inputs" : this.title = "Code editor";
            document.getElementById("switch_input_panel_button").classList.toggle('code_editor');
        }}
    >
        <button id="switch_input_panel_button">
        </button>
    </abbr>

    return switch_button;
}