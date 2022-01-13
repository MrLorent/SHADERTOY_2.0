import createElement from './createElement.js';

// Create some dom elements
export const slider = (id, label, name, min, max) => {
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
        <label for={name}>{label}</label>
    </div>

    return slider;
}