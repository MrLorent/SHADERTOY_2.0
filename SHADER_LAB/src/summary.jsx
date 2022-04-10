import createElement from "./Inputs/createElement.js";

export default (summary_part, page_name) => {
    const summary =
    <p onclick = {function(){ 
        var pageToHide = document.querySelector('.show_page');
        pageToHide.classList.remove("show_page");
        var pageToShow = document.getElementById(summary_part);
        pageToShow.classList.add('show_page');
    }}>
        {page_name}

    </p>;

    return summary;
}