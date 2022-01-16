import * as THREE from 'three';

export default (scene, shader) => {
    let file_loader = new THREE.FileLoader();

    file_loader.load(shader.vertex_shader_path, function(vs){
        shader.vertex_shader = vs;
        let material;
        file_loader.load(shader.fragment_shader_path, function(fs){
            shader.fragment_shader=fs;
        

            material = new THREE.ShaderMaterial({
                uniforms: shader.uniforms,
                vertexShader: shader.vertex_shader,
                fragmentShader: shader.fragment_shader,
                depthTest: false,
                depthWrite: false
            });

            scene.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), material)
            scene.scene.add(scene.mesh)
            scene.camera.add(scene.mesh)
        });
    });
}