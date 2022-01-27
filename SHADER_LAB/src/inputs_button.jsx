import createElement from "./Inputs/createElement.js";

export default () => {
    const inputs_button = 
        <button
            id="shader_inputs_button"
            className="nav_button"
            onclick={function(){
                document.querySelector('#interactive_window .container').style.flexDirection = "row-reverse";

                // CURRENT NAV BUTTON
                document.querySelector('.nav_button.active').classList.remove('active');
                this.classList.add('active');
            }}
            title = "Inputs"
        >
        </button>

    return inputs_button;
}