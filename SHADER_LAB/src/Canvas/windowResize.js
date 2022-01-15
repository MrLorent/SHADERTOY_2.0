import * as GLOBALS from "./globals.js";


export default function on_window_resize(scene, shader)
{

	GLOBALS.window_is_being_resized = true;

	let SCREEN_WIDTH = 800 ;
	let SCREEN_HEIGHT = 600 ;

	scene.renderer.setPixelRatio(1);
	scene.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	shader.uniforms.uResolution.value.x = scene.context.drawingBufferWidth;
	shader.uniforms.uResolution.value.y = scene.context.drawingBufferHeight;

	scene.target.setSize(scene.context.drawingBufferWidth, scene.context.drawingBufferHeight);

	scene.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	scene.camera.updateProjectionMatrix();

}