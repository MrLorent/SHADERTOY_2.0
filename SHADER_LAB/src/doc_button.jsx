import createElement from "./Inputs/createElement.js";

export default () => {
    const doc_button = 
    <abbr 
        title="documentation"
    >
        <button
            id="doc_button"
            onclick={() => {
                let doc = document.querySelector('#documentation');
                doc.classList.toggle('display');
            }}
        >
        </button>
    </abbr>

    return doc_button;
}