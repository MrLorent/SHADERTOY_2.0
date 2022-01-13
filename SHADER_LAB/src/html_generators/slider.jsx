import createElement from './createElement.js';
import * as GLOBAL from '../global.js';

// Create some dom elements
export const slider = (id, label, name, min, max) => {
    const slider = 
    <div className='input-container slider'>
        <input
            oninput={function(){ console.log(GLOBAL.inputVal); GLOBAL.inputVal = this.value; }}
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