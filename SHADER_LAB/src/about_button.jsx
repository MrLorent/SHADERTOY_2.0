import createElement from "./Inputs/createElement.js";

export default () => {
    const about_button = 
    <abbr title="About Shader Lab">
        <button
            onclick={() => { 
                document.querySelector('section#about').classList.toggle('display');
            }}
            id="about_button"
        >
        </button>
    </abbr>

    return about_button;
}