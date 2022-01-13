let pixel_ratio =1;
let window_is_being_resized = false;
let file_loader;
let frame_time, elapsed_time;
let renderer, clock;
let world_camera;
let ray_marching_scene;
let ray_marching_uniforms;
let ray_marching_defines;
let ray_marching_vertex_shader, ray_marching_fragment_shader;
let ray_marching_geometry, ray_marching_material, ray_marching_mesh;
let ray_marching_render_target;
let context;

let colors;
let kd;
let ks;
let ka;
let alpha;
