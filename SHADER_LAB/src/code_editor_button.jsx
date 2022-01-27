import createElement from "./Inputs/createElement.js";

export default () => {
    const code_editor_button = 
    <button
        id="code_editor_button"
        className="nav_button"
        onclick={function(){
            document.querySelector('#interactive_window .container').style.flexDirection = "row";

            // CURRENT NAV BUTTON
            document.querySelector('.nav_button.active').classList.remove('active');
            this.classList.add('active');
        }}
        title = "Code Editor"
    >
    </button>

    return code_editor_button;
}