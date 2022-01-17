import createElement from "./createElement.js";

export default (id, label, name, value) => {
    const colorPicker = 
    <div className="input-container color-picker">
        <input
        type    = { color }
        id      = { id }
        name    = { name }
        value   = { value }
        />
        <label htmlFor={name}>{label}</label>
    </div>

    return colorPicker
}