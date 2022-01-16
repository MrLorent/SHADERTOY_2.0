let frame_time;
let elapsed_time;
import * as GLOBALS from "./globals.js";

export default function animate(){
    frame_time=GLOBALS.clock.getDelta();
    elapsed_time=GLOBALS.clock.getElapsedTime() % 1000;

    GLOBALS.currentShader.uniforms.uTime.value = elapsed_time;
    GLOBALS.currentScene.camera.updateMatrixWorld(true);
    GLOBALS.currentShader.uniforms.uCameraPosition.value.copy(GLOBALS.currentScene.camera.position);

    GLOBALS.currentScene.renderer.setRenderTarget(null);
    GLOBALS.currentScene.renderer.render(GLOBALS.currentScene.scene, GLOBALS.currentScene.camera);
    requestAnimationFrame(animate);
}