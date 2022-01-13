import * as GLOBALS from "./globals.js";


export default function on_window_resize(event)
{

	GLOBALS.window_is_being_resized = true;

	let SCREEN_WIDTH = 800 ;
	let SCREEN_HEIGHT = 600 ;

	GLOBALS.renderer.setPixelRatio(GLOBALS.pixel_ratio);
	GLOBALS.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	GLOBALS.ray_marching_uniforms.uResolution.value.x = GLOBALS.context.drawingBufferWidth;
	GLOBALS.ray_marching_uniforms.uResolution.value.y = GLOBALS.context.drawingBufferHeight;

	GLOBALS.ray_marching_render_target.setSize(GLOBALS.context.drawingBufferWidth, GLOBALS.context.drawingBufferHeight);

	GLOBALS.world_camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	GLOBALS.world_camera.updateProjectionMatrix();

}