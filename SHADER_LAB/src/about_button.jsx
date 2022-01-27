import createElement from "./Inputs/createElement.js";

export default () => {
    const about_button = 
    <button
        id="about_button"
        className="nav_button"
        onclick={function(){ 
            document.querySelector('section#about').classList.toggle('display');
        }}
        title = "Information"
    >
    </button>

    return about_button;
}