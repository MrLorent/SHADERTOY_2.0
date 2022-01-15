let frame_time;
let elapsed_time;
import * as GLOBALS from "./globals.js";

export default function animate(){
    frame_time=GLOBALS.clock.getDelta();
    elapsed_time=GLOBALS.clock.getElapsedTime() % 1000;

    GLOBALS.shader.uniforms.uTime.value = elapsed_time;
    GLOBALS.scene.camera.updateMatrixWorld(true);
    GLOBALS.shader.uniforms.uCameraPosition.value.copy(GLOBALS.scene.camera.position);

    GLOBALS.scene.renderer.setRenderTarget(null);
    GLOBALS.scene.renderer.render(GLOBALS.scene.scene, GLOBALS.scene.camera);
    requestAnimationFrame(animate);
}