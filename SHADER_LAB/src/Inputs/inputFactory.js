import Slider from './Slider.js';
import Checkbox from './Checkbox.js';
import ColorPicker from './ColorPicker.js';

export default (input_details)=>{
    let new_input;
    if(input_details['type'] == "checkbox")
    {
        return new Checkbox(
            input_details['label'],
            input_details['name'],
            input_details['checked']
        );
    }
    else if(input_details['type'] == "slider")
    {
        return new Slider(
            input_details[  'label' ],
            input_details[  'name'  ],
            input_details[  'min'   ],
            input_details[  'max'   ],
            input_details[  'step'  ]
        );
    }
    else if(input_details['type'] == "color_picker")
    {
        return new ColorPicker(
            input_details[  'label' ],
            input_details[  'name'  ],
            input_details[  'value' ]
        );
    }
    //else if color picker
    ;
}