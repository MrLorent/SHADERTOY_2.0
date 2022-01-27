import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Scene{
    renderer;
    scene;
    camera;

    clock;
    frame_time;
    elapsed_time;

    mesh;
    target;
    context;

    constructor(){
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('webgl_canvas'),
            context: document.getElementById('webgl_canvas').getContext('webgl2')
        });
        this.renderer.debug.checkShaderErrors = true;
        this.renderer.autoClear = false;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
    
        this.context = this.renderer.getContext();
        this.context.getExtension('EXT_color_buffer_float');

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(60, document.body.clientWidth / document.body.clientHeight, 1, 1000);
        this.camera.position.y=1;
        this.camera.fov = 31;
        this.scene.add(this.camera);

        this.camera_controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.camera_controls.target.set(0,1,5);
        this.camera_controls.maxDistance=10;
        this.camera_controls.minDistance=3;
        this.camera_controls.minPolarAngle=this.camera_controls.maxPolarAngle=1.57079;
        this.camera_controls.maxAzimuthAngle=-2.6;
        this.camera_controls.minAzimuthAngle=2.6;

        this.clock = new THREE.Clock();

        this.mesh = new THREE.Mesh();

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

    init(material)
    {
        this.mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2,2),
            material
        );

        this.scene.add(this.mesh);
        this.camera.add(this.mesh);
        this.renderer.compile(this.scene, this.camera);
    }

    update(material)
    {
        this.mesh.material = material;
    }
}