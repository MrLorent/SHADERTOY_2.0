import createElement from "./Inputs/createElement.js";

export default (class_name, legend) => {
    const input_fieldset =
    <fieldset className={class_name}>
        <legend>{legend}</legend>
    </fieldset>

    return input_fieldset;
}