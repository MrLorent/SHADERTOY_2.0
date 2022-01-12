import vs from "../shaders/vertexShader.glsl"
import mainshader from "../shaders/simpleShader.glsl"

var sceneIsDynamic = false;
var camFlightSpeed = 300;
var boxMesh = [];
var sphereMesh = [];

var nbBoxes=3;
var nbSpheres=3;

// called automatically from within initTHREEjs() function
function initSceneData() 
{
    //en réalité le material a plutôt l'air choisi dans le shader donc je laisse ces valeurs les mêmes pour tous les objets
    let globalMaterial = new THREE.MeshPhysicalMaterial( {
        color: new THREE.Color(0.0, 0.0, 0.95), //RGB, ranging from 0.0 - 1.0
        roughness: 0.2 // ideal Diffuse material	
    } );
	// scene/demo-specific three.js objects setup goes here

	// pixelRatio is resolution - range: 0.5(half resolution) to 1.0(full resolution)
	pixelRatio = mouseControl ? 1.0 : 0.75; // less demanding on battery-powered mobile devices

	EPS_intersect = 0.01;

	// Boxes
    for (let i=0; i<nbBoxes; i++){
        let tmpBoxGeometry = new THREE.BoxGeometry(1,1,1);
        // let tmpBoxMaterial = new THREE.MeshPhysicalMaterial( {
        //     color: new THREE.Color(0.0, 0.0, 0.95), //RGB, ranging from 0.0 - 1.0
        //     roughness: 0.2 // ideal Diffuse material	
        // } );
        
        //tmpBoxMesh = new THREE.Mesh(tmpBoxGeometry, tmpBoxMaterial);
        boxMesh.push(new THREE.Mesh(tmpBoxGeometry, globalMaterial));
        pathTracingScene.add(boxMesh[i]);
        boxMesh[i].visible = false; // disable normal Three.js rendering updates of this object: 
        // it is just a data placeholder as well as an Object3D that can be transformed/manipulated by 
        // using familiar Three.js library commands. It is then fed into the GPU path tracing renderer
        // through its 'matrixWorld' matrix. See below:
        boxMesh[i].position.set(0, 0, 0);
        //boxMesh[i].rotation.set(0, Math.PI * 0.3, 0);
        boxMesh[i].updateMatrixWorld(true);
    }
    for (let i=0; i<nbSpheres; i++){
        let tmpSphereGeometry = new THREE.SphereGeometry(1,1,1);
        // let tmpSphereMaterial = new THREE.MeshPhysicalMaterial( {
        //     color: new THREE.Color(0.0, 0.0, 0.95), //RGB, ranging from 0.0 - 1.0
        //     roughness: 0.2 // ideal Diffuse material	
        // } );
        
        //tmpBoxMesh = new THREE.Mesh(tmpBoxGeometry, tmpBoxMaterial);
        sphereMesh.push(new THREE.Mesh(tmpSphereGeometry, globalMaterial));
        pathTracingScene.add(sphereMesh[i]);
        sphereMesh[i].visible = false; // disable normal Three.js rendering updates of this object: 
        // it is just a data placeholder as well as an Object3D that can be transformed/manipulated by 
        // using familiar Three.js library commands. It is then fed into the GPU path tracing renderer
        // through its 'matrixWorld' matrix. See below:
        //sphereMesh[i].rotation.set(0, Math.PI * 0.1, 0);
        sphereMesh[i].position.set(0, 0.5, 0);
        sphereMesh[i].updateMatrixWorld(true);
    }

    // 'true' forces immediate matrix update
	

	// set camera's field of view
	worldCamera.fov = 31;
	// focusDistance = 1180.0;

} // end function initSceneData()



// called automatically from within initTHREEjs() function
function initPathTracingShaders() 
{
	// scene/demo-specific uniforms go here  

    //BOXES
    let boxMatrixes= [];
    let boxColor = [];
    let boxType = [];
    for(let i=0; i<nbBoxes; i++){
        boxMatrixes.push(new THREE.Matrix4());
        boxColor.push(new THREE.Color('orange'));
        boxType.push(1);
    }
    boxType[1]=3;
    boxColor[1]=new THREE.Color('white');

    //on envoie les valeurs au shader via uniforms
    pathTracingUniforms.uBoxInvMatrix =  { type: "Matrix4fv", value: boxMatrixes }
    pathTracingUniforms.uBoxColor = { value: boxColor}
    pathTracingUniforms.uBoxType = { value: boxType}

    //SPHERES
    let sphereMatrixes= [];
    let sphereColor = [];
    let sphereType = [];
    for(let i=0; i<nbBoxes; i++){
        sphereMatrixes.push(new THREE.Matrix4());
        sphereColor.push(new THREE.Color('blue'));
        sphereType.push(1);
    }
    let colors = [new THREE.Color('white'),new THREE.Color('purple')];
    let k = [new THREE.Vector4(0.1,0.2,0.3,30), new THREE.Vector4(0.1,0.2,0.3,30)]

    pathTracingUniforms.uSphereInvMatrix =  { type: "Matrix4fv", value: sphereMatrixes }
    pathTracingUniforms.uSphereColor = { value: sphereColor}
    pathTracingUniforms.uSphereType = { value: sphereType}
    pathTracingUniforms.uColors = {value: colors}
    pathTracingUniforms.uK={value: k}

	
	pathTracingDefines = {
		//NUMBER_OF_TRIANGLES: total_number_of_triangles
	};

	// load vertex and fragment shader files that are used in the pathTracing material, mesh and scene
    pathTracingVertexShader=vs;
    createPathTracingMaterial();
	// fileLoader.load(vs, function (shaderText) {
	// 	pathTracingVertexShader = shaderText;

	// 	createPathTracingMaterial();
	// });

} // end function initPathTracingShaders()


// called automatically from within initPathTracingShaders() function above
function createPathTracingMaterial() 
{
    pathTracingFragmentShader = mainshader;

    pathTracingMaterial = new THREE.ShaderMaterial({
        uniforms: pathTracingUniforms,
        defines: pathTracingDefines,
        vertexShader: pathTracingVertexShader,
        fragmentShader: pathTracingFragmentShader,
        depthTest: false,
        depthWrite: false
    });

    pathTracingMesh = new THREE.Mesh(pathTracingGeometry, pathTracingMaterial);
    pathTracingScene.add(pathTracingMesh);

    // the following keeps the large scene ShaderMaterial quad right in front 
    //   of the camera at all times. This is necessary because without it, the scene 
    //   quad will fall out of view and get clipped when the camera rotates past 180 degrees.
    worldCamera.add(pathTracingMesh);

	// fileLoader.load('shaders/simpleShader.glsl', function (shaderText) {
		
	// 	pathTracingFragmentShader = shaderText;

	// 	pathTracingMaterial = new THREE.ShaderMaterial({
	// 		uniforms: pathTracingUniforms,
	// 		defines: pathTracingDefines,
	// 		vertexShader: pathTracingVertexShader,
	// 		fragmentShader: pathTracingFragmentShader,
	// 		depthTest: false,
	// 		depthWrite: false
	// 	});

	// 	pathTracingMesh = new THREE.Mesh(pathTracingGeometry, pathTracingMaterial);
	// 	pathTracingScene.add(pathTracingMesh);

	// 	// the following keeps the large scene ShaderMaterial quad right in front 
	// 	//   of the camera at all times. This is necessary because without it, the scene 
	// 	//   quad will fall out of view and get clipped when the camera rotates past 180 degrees.
	// 	worldCamera.add(pathTracingMesh);
		
	// });

} // end function createPathTracingMaterial()



// called automatically from within the animate() function
function updateVariablesAndUniforms() 
{   
	// BOXES
    let matrixesWorld = [];
    for(let i=0; i<nbBoxes; i++){
        let matrix=boxMesh[i].matrixWorld.invert()
        matrixesWorld.push(matrix.clone());
    }   

    pathTracingUniforms.uBoxInvMatrix.value = matrixesWorld;

    let matrixesWorldSphere = [];
    for(let i=0; i<nbSpheres; i++){
        let matrix=sphereMesh[i].matrixWorld
        matrixesWorldSphere.push(matrix.clone());
    }   

    pathTracingUniforms.uSphereInvMatrix.value = matrixesWorldSphere;

	// INFO
	// cameraInfoElement.innerHTML = "FOV: " + worldCamera.fov + " / Aperture: " + apertureSize.toFixed(2) + " / FocusDistance: " + focusDistance + "<br>" + "Samples: " + sampleCounter;

} // end function updateVariablesAndUniforms()
