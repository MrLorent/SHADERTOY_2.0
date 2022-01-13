import createElement from './createElement.jsx';

// Create some dom elements
export const slider = (id, label, name, min, max) => {
    const slider = 
    <div className='slider_input'>
        <input
            type="range"
            id={id}
            name={name}
            min={min}
            max={max}
        />
        <label for={name}>{label}</label>
    </div>

    return slider;
}