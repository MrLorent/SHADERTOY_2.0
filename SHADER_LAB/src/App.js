import vertex from './shaders/vertex/vertexShader.glsl'
import fragment from './shaders/fragment/phongIllumination.glsl'
import Scene from './Canvas/Scene.js'

import init from './Canvas/init.js'
import * as GLOBALS from './Canvas/globals.js'

import Input from './Canvas/Input.js';
import Slider from './Canvas/Slider.js'
import Checkbox from './Canvas/Checkbox.js'
import Shader from './Canvas/Shader.js'

export class App
{
    constructor(){}

    run()
    {
        let inputsShader = []
        const checkbox = new Checkbox("Rotate light", "rotate_light", true);
        const sliderTest = new Slider("Alpha", "alpha", 0,100,1);
        inputsShader.push(checkbox);
        inputsShader.push(sliderTest);

        GLOBALS.shader = new Shader("Flat painting", vertex, fragment, inputsShader);
        GLOBALS.scene = new Scene();
        console.log(GLOBALS.shader)
        console.log(GLOBALS.scene)

        init(vertex, fragment);
    }
}