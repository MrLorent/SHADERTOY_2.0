import createElement from './createElement.js';

// Create a slider as HTML
export default (id, label, name, min, max) => {
    const slider = 
    <div className='input-container slider'>
        <input
            // oninput={}
            type="range"
            id={id}
            name={name}
            min={min}
            max={max}
            step="1"
        />
        <label htmlFor={name}>{label}</label>
    </div>

    return slider;
}