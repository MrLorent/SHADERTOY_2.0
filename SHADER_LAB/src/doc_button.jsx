import createElement from "./Inputs/createElement.js";

export default () => {
    const doc_button = 
    <button
        id="doc_button"
        className="nav_button"
        onclick={function(){
            let doc = document.querySelector('#documentation');
            doc.classList.toggle('display');
        }}
    title  = "Documentation"
    >
    </button>

    return doc_button;
}