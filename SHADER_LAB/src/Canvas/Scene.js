import * as THREE from 'three';

export default class Scene{
    renderer;
    scene;
    camera;
    mesh;
    target;
    context;

    constructor(){
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('canvas.webgl'),
            context: document.querySelector('canvas.webgl').getContext('webgl2')
        });
        this.renderer.debug.checkShaderErrors = true;
        this.renderer.autoClear = false;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
    
        this.context = this.renderer.getContext();
        this.context.getExtension('EXT_color_buffer_float');

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(60, document.body.clientWidth / document.body.clientHeight, 1, 1000);
        this.camera.position.y=1;
        this.scene.add(this.camera);

        this.target = new THREE.WebGLRenderTarget(this.context.drawingBufferWidth, this.context.drawingBufferHeight, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            depthBuffer: false,
            stencilBuffer: false
        });
        this.target.texture.generateMipmaps = false;
    
    }
}