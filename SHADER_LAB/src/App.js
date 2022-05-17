import * as THREE from 'three';

import init_shader_chunk from './Canvas/init_shader_chunk.js';
import Scene from './Canvas/Scene.js'
import code_editor_button_as_HTML from './code_editor_button.jsx';
import {CodeEditor} from './CodeEditor.js';
import compile_button_as_HTML from './compile_button.jsx'
import doc_button_as_HTML from './doc_button.jsx';
import input_fieldset_as_HTML from './input_fieldset.jsx';
import shader_inputs_button_as_HTML from './inputs_button.jsx';
import light_button_as_HTML from './light_button.jsx';
import nav_bar_as_HTML from './nav_bar.jsx';
import scene_button_as_HTML from './scene_button.jsx';
import summary_as_HTML from './summary.jsx';

export class App {
  // LIST OF SCENE ELEMENTS
  FLOOR = 0
  PRESET_1_SPHERE = 1;
  PRESET_1_BOX = 2;
  SCENE_ELEMENTS = 2;

  // LIST OF SHADERS
  FLAT_PAINTING = 0;
  LAMBERT = 1;
  LAMBERT_WITH_BOUNCE = 2;
  PHONG = 3;
  COOK_TORRANCE = 4;
  PERSONAL = 5;

  NUMERO_PRESET = 0;

  scene;

  codeEditor;

  shader_list;
  current_shader;

  constructor(shader_list) {
    // CODE_EDITOR
    this.codeEditor = new CodeEditor('code_editor');
    this.insert_compile_button();

    // INIT LIST OF SHADERS
    this.shader_list = shader_list;
    for (let i in this.shader_list) {
      this.shader_list[i].set_fragment_shader(
          this.codeEditor.compile_inputed_uniforms(
              this.shader_list[i].fragment_shader, this.shader_list[i]));
      this.shader_list[i].init_material();
    }
    init_shader_chunk(THREE.ShaderChunk);
    this.insert_shader_buttons_in_HTML();

    // INIT CURRENT SHADER
    this.current_shader = this.FLAT_PAINTING;
    this.insert_inputs_in_HTML();

    // SCENE
    this.scene = new Scene();
    this.scene.init(this.shader_list[this.current_shader].get_material());

    // SETUP CURRENT SHADER
    this.codeEditor.set_value(
        this.shader_list[this.current_shader].fragment_shader);
    this.update_shader();

    // WINDOW MANAGEMENT
    this.on_window_resize(this.scene, this.shader_list[this.current_shader]);
    window.addEventListener('resize', () => {
      this.on_window_resize(this.scene, this.shader_list[this.current_shader]);
    }, false);

    // NAVIGATION
    this.insert_navigation_panel_buttons_in_HTML();
    this.insert_scene_buttons_in_HTML();
    this.insert_light_buttons_in_HTML();
    this.insert_summary_nav_in_HTML();

    document.querySelector('button.displayer.light_list')
        .addEventListener('click', () => {
          document.querySelector('.input_container.light')
              .classList.toggle('unwrap');
        });

    document.querySelector('button.displayer.scene_list')
        .addEventListener('click', () => {
          document.querySelector('.input_container.scene')
              .classList.toggle('unwrap');
        })
  }

  switch_shader(new_shader_id) {
    let light_button = document.querySelector('.input_container.light');
    if (new_shader_id == this.FLAT_PAINTING) {
      light_button.style.display = 'none';
    } else {
      light_button.style.display = 'flex';
    }

    /* We change the current shader id */
    this.current_shader = new_shader_id;
    this.scene.update(this.shader_list[this.current_shader].get_material());
    this.insert_inputs_in_HTML();
    this.on_window_resize(this.scene, this.shader_list[this.current_shader]);

    if (this.shader_list[this.current_shader].get_name() ===
        'Code your own shader !') {
      this.codeEditor.set_value(this.codeEditor.remove_include_personal(
          this.shader_list[this.current_shader].fragment_shader));
      this.shader_list[this.current_shader].fragment_shader =
          this.codeEditor.add_include_personal(
              this.shader_list[this.current_shader].fragment_shader,
              this.NUMERO_PRESET)

    } else {
      this.codeEditor.set_value(
          this.shader_list[this.current_shader].fragment_shader);
    }
  }

  update_shader() {
    let console_ = document.getElementById('console');
    let user_shader_input = this.codeEditor.get_value();

    if (this.shader_list[this.current_shader].get_name() ===
        'Code your own shader !') {
      user_shader_input = this.codeEditor.add_include_personal(
          user_shader_input, this.NUMERO_PRESET)
      user_shader_input += '\n' +
          '#include <main>'
    }

    user_shader_input = this.codeEditor.compile_inputed_uniforms(
        user_shader_input, this.shader_list[this.current_shader]);

    const compilation_test = this.codeEditor.check_shader_compilation(
        this.scene, user_shader_input, this.NUMERO_PRESET,
        this.shader_list[this.current_shader]);
    if (compilation_test.status === 'success') {
      this.shader_list[this.current_shader].fragment_shader = user_shader_input;
      this.shader_list[this.current_shader].update_material();
      this.switch_shader(this.current_shader);
      console_.classList.remove('fail');
    } else {
      console_.classList.add('fail');
    }

    console_.innerHTML = '\\> ' + compilation_test.message;
  }

  update_preset(preset) {
    let new_text = '';

    if (this.shader_list[this.current_shader].get_name() ===
        'Code your own shader !') {
      this.NUMERO_PRESET = preset;
      new_text = this.codeEditor.change_scene_include(preset);
      new_text =
          this.codeEditor.add_include_personal(new_text, this.NUMERO_PRESET);
      new_text += '\n' +
          '#include <main>'
    } else {
      this.NUMERO_PRESET = preset;
      new_text = this.codeEditor.change_scene_include(preset);
    }

    this.shader_list[this.current_shader].fragment_shader = new_text;
    this.shader_list[this.current_shader].update_material();
    this.switch_shader(this.current_shader);
  }

  update_light(preset) {
    this.shader_list[this.current_shader].uniforms.uSecond_Light_on_off.value =
        preset;
    if (this.shader_list[this.current_shader]
            .uniforms.uSecond_Light_on_off.value === 1) {
      this.shader_list[this.current_shader].uniforms.uColorLight.value =
          new THREE.Color('white');
    }
    if (this.shader_list[this.current_shader]
            .uniforms.uSecond_Light_on_off.value === 0) {
      this.shader_list[this.current_shader].uniforms.uColorLight.value =
          new THREE.Color('white');
    }
    this.switch_shader(this.current_shader);
  }

  insert_scene_buttons_in_HTML() {
    const navigation_panel =
        document.querySelector('#visual_window .input_container.scene');
    navigation_panel.insertBefore(
        scene_button_as_HTML(this, 1), navigation_panel.firstChild);
    navigation_panel.insertBefore(
        scene_button_as_HTML(this, 0), navigation_panel.firstChild);
  }

  insert_light_buttons_in_HTML() {
    const navigation_panel =
        document.querySelector('#visual_window .input_container.light');
    navigation_panel.insertBefore(
        light_button_as_HTML(this, 1), navigation_panel.firstChild);
    navigation_panel.insertBefore(
        light_button_as_HTML(this, 0), navigation_panel.firstChild);
  }

  insert_navigation_panel_buttons_in_HTML() {
    const navigation_panel = document.getElementById('navigation_panel');
    let inputs_button = shader_inputs_button_as_HTML();
    inputs_button.classList.add('active');
    navigation_panel.append(inputs_button);
    navigation_panel.append(code_editor_button_as_HTML());
    navigation_panel.append(doc_button_as_HTML());
  }

  insert_compile_button() {
    const code_editor_buttons = document.getElementById('code_editor_panel');
    code_editor_buttons.append(compile_button_as_HTML(this));
  }

  insert_shader_buttons_in_HTML() {
    const shader_link_container = document.querySelector('nav .discover_link');

    let shaders_name = [];
    let shaders_id = [];

    for (let i in this.shader_list) {
      if (this.shader_list[i].get_name() ===
          this.shader_list[this.shader_list.length - 1].get_name()) {
        const code_link = document.querySelector('.code_link a');
        code_link.addEventListener('click', event => {
          event.preventDefault();
        })
        const code_button = document.querySelector('.code_link');
        code_button.addEventListener('click', () => {
          this.switch_shader(i);
          this.update_preset(this.NUMERO_PRESET);
        });
      } else {
        shaders_name.push(this.shader_list[i].get_name());
        shaders_id[this.shader_list[i].get_name()] = i;
      }
    }
    shader_link_container.append(
        nav_bar_as_HTML(shaders_name, shaders_id, this));
  }

  insert_summary_nav_in_HTML() {
    const summary_nav = document.getElementById('summary');

    let pages = ['scenes', 'lights', 'inputs', 'help', 'example'];
    let pages_names = ['Scenes', 'Lights', 'Inputs', 'Help', 'Example'];

    for (let i in pages) {
      summary_nav.append(summary_as_HTML(pages[i], pages_names[i]));
    }
  }

  insert_inputs_in_HTML() {
    const HTML_container =
        document.querySelector('#interactive_window .input_container');
    while (HTML_container.firstElementChild) {
      HTML_container.removeChild(HTML_container.firstElementChild);
    }
    HTML_container.innerHTML = ''

    const shader = this.shader_list[this.current_shader];
    const light_inputs = shader.get_light_inputs();

    if (light_inputs.length != 0) {
      let light_input_container = input_fieldset_as_HTML(light_inputs, 'Light');
      for (let i in light_inputs) {
        light_input_container.append(
            light_inputs[i].get_as_HTML(this.SCENE, shader));
      }
      HTML_container.append(light_input_container);
    }

    const scene_inputs = shader.get_scene_inputs();
    const colors_input = shader.get_colors_inputs();

    console.log('inpuuuts : ', scene_inputs)

    if (scene_inputs.length != 0 || colors_input.length != 0) {
      switch (this.NUMERO_PRESET) {
        case 0:
          this.SCENE_ELEMENTS = 2;
          for (let k = 0; k < this.SCENE_ELEMENTS; k++) {
            let legend = '';
            k == 0 ? legend = 'Box' : legend = 'Sphere';
            let scene_input_container =
                input_fieldset_as_HTML(scene_inputs, legend)
            if (shader.get_name() != 'Code your own shader !') {
              scene_input_container.append(
                  colors_input[k].get_as_HTML(k, shader));
            }
            for (let i in scene_inputs) {
              scene_input_container.append(
                  scene_inputs[i].get_as_HTML(k, shader));
            }
            HTML_container.append(scene_input_container);
          }
          break;
        case 1:
          this.SCENE_ELEMENTS = 3;
          for (let k = 0; k < this.SCENE_ELEMENTS; k++) {
            let legend = '';
            k == 0 ? legend = 'Sphere 1' :
                     k == 1 ? legend = 'Sphere 2' : legend = 'Sphere 3';
            let scene_input_container =
                input_fieldset_as_HTML(scene_inputs, legend)
            if (shader.get_name() != 'Code your own shader !') {
              scene_input_container.append(
                  colors_input[k].get_as_HTML(k, shader));
            }
            for (let i in scene_inputs) {
              scene_input_container.append(
                  scene_inputs[i].get_as_HTML(k, shader));
            }
            HTML_container.append(scene_input_container);
          }
      }
    }

    if (light_inputs.length == 0 && scene_inputs == 0 && colors_input == 0) {
      HTML_container.innerHTML = 'No input detected for this shader yet.';
    }
  }



  render() {
    this.scene.frame_time = this.scene.clock.getDelta();
    this.scene.elapsed_time = this.scene.clock.getElapsedTime() % 1000;

    this.shader_list[this.current_shader].uniforms.uTime.value =
        this.scene.elapsed_time;
    this.scene.camera.updateMatrixWorld(true);
    this.shader_list[this.current_shader].uniforms.uCameraPosition.value.copy(
        this.scene.camera.position);
    this.shader_list[this.current_shader].uniforms.uCameraMatrix.value.copy(
        this.scene.camera.matrixWorld);
    this.scene.renderer.setRenderTarget(null);
    this.scene.renderer.render(this.scene.scene, this.scene.camera);
  }

  on_window_resize(scene, current_shader) {
    let SCREEN_WIDTH = window.innerWidth * 0.33;
    let SCREEN_HEIGHT = window.innerHeight * 0.5;

    scene.renderer.setPixelRatio(1);
    scene.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    current_shader.uniforms.uResolution.value.x =
        scene.context.drawingBufferWidth;
    current_shader.uniforms.uResolution.value.y =
        scene.context.drawingBufferHeight;

    scene.target.setSize(
        scene.context.drawingBufferWidth, scene.context.drawingBufferHeight);

    scene.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    scene.camera.updateProjectionMatrix();

    this.codeEditor.resize();
  }
}