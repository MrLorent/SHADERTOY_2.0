import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/** Raycaster */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 60
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor('#262837')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1

    //console.log(mouse)
})

const raycaster = new THREE.Raycaster()


const geometry = new THREE.SphereGeometry( 15, 32, 16 );
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const sphere = new THREE.Mesh( geometry, material );


sphere.position.z=0

const objectsToTest=[sphere]

function rayIntersect(raycaster, objects){
    const intersects = raycaster.intersectObjects(objects)
    for(const intersect of intersects)
    {
        var dotGeometry = new THREE.BufferGeometry();
        dotGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( intersect.point.toArray(), 3))//new THREE.Vector3().toArray(), 3 ) );
        var dotMaterial = new THREE.PointsMaterial( { size: 0.5 , color: '#3dd998'} );
        var dot = new THREE.Points( dotGeometry, dotMaterial );
        scene.add( dot );
    }
}

for(let i=0; i<window.innerWidth; i+=1){
    let x = -1+2*(i/(window.innerWidth));
    for(let j=0; j<window.innerHeight; j+=1){
        let y=- (j / window.innerHeight) * 2 + 1        //1-2*(j/window.innerHeight);
        const raycaster_fenetre = new THREE.Raycaster()
        const rayOrigin = new THREE.Vector3(0,0,100)
        const rayDirection = new THREE.Vector3(x,y,-1)
        rayDirection.normalize()

        raycaster_fenetre.set(rayOrigin, rayDirection)
        rayIntersect(raycaster_fenetre, objectsToTest)
    }
}
    

const tick = () =>
{

raycaster.setFromCamera(mouse, camera)

    // Update controls
    controls.update()

    var start = new Date()
    // Render
    renderer.render(scene, camera)
    var time = new Date() - start
    console.log(time)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

}

tick()