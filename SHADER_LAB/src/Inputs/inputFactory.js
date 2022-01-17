import Slider from './Slider.js';
import Checkbox from './Checkbox.js';

export default (input_details)=>{
    let new_input ;
    if(input_details['type'] == "checkbox"){
        new_input=
            new Checkbox(
                input_details[  'label'     ],
                input_details[  'name'      ],
                input_details[  'checked'   ]
            );
    }
    else if(input_details['type'] == "slider"){
        new_input=
            new Slider(
                input_details[  'label' ],
                input_details[  'name'  ],
                input_details[  'min'   ],
                input_details[  'max'   ],
                input_details[  'step'  ]
            );
    }
    //else if color picker
    return new_input;
}