import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from '/jsm/loaders/OBJLoader.js';
import { DRACOLoader } from '/jsm/loaders/DRACOLoader.js';
import {ImprovedNoise} from '/jsm/math/ImprovedNoise.js'; 

/*
const startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init );
Tone.start(); 
*/

document.querySelector('button').addEventListener('click', async () => {
    // console.log('audio is ready')   
    await Tone.start();   
    init();
})

let camera, scene, renderer;
let light, light2;

let obj, objClone;
let gltfBool = false;
const perlin = new ImprovedNoise();

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove );

let loopOf; 
let contAnim = 0; 

const clock = new THREE.Clock();

function init(){

    const overlay = document.getElementById( 'overlay' );
    overlay.remove();

    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );
    instructions.remove(); 
    blocker.remove();

    const container = document.createElement( 'div' );
    document.body.appendChild( container );
    
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 1000 );
    camera.position.set( 0, 0, -2 );
    
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff); 

    light = new THREE.PointLight( 0xffffff, 2, 10 );
    light.position.set( 0, 0, 0 );
    scene.add( light );
    
    light2 = new THREE.PointLight( 0xffffff, 2, 10 );
    light2.position.set( 0, 0, 0 );
    scene.add( light2 );

    // aqui va el archivo
 
    let loader = new GLTFLoader();
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/js/draco/' );
    loader.setDRACOLoader( dracoLoader );
    
    loader.load(
	 'cap/2022-03-22--20-32-39.gltf',
	//  'cap/0000000.gltf',
	//'cap/prueba.glb', 
	function ( gltf ) {
	    
	    //fuente.position.set(0, 0, 40)

	    obj = gltf.scene.children[0];
	    objeto(contAnim); // children 0 

	    console.log(obj.children.length );
	    
	    loopOf = new Tone.Loop((time) => {
	
		if(contAnim > obj.children.length -17 ) { // cuadros malos 
		    contAnim = 0;
		    console.log("hola"); 
		    
		}
		
		scene.remove(scene.children[2]);
		
		contAnim++;
		
		scene.add(obj.children[contAnim].clone() ); 
		scene.children[2].rotation.y = Math.PI;
		scene.children[2].position.z = -8;
		scene.children[2].material.size = 1.1;
		scene.children[2].scale.x = 16;
		scene.children[2].scale.y = 16;
		scene.children[2].scale.z = 16; 
		
	    }, "1.5");
	    
	    Tone.Transport.start();
	    loopOf.start(0);   
	})
    
    //scene.add( obj.scene.children[0].children[0]  )
    // console.log( obj ); 
    
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );
    
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // use if there is no animation loop
    //controls.minDistance = 2;
    //controls.maxDistance = 10;
    controls.target.set( 0, 0, 0 );
    controls.update();
    
    window.addEventListener( 'resize', onWindowResize );

    animate();
    
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    // animate();
    
}

function objeto (children){
    console.log(obj.children[children]);
    gltfBool = true;
    
    scene.add(obj.children[children].clone() );
    
     
}

function animate(){
    requestAnimationFrame ( animate );
    render();
}

function render() {

    const time = Date.now() * 0.0005;
    const delta = clock.getDelta();

    
    if(gltfBool){

	scene.children[2].geometry.computeVertexNormals(); 

	// camera.lookAt(0, 0, 2); 

    for( var i = 0; i < scene.children[2].geometry.attributes.position.count; i++){

	let d = perlin.noise(scene.children[2].geometry.attributes.position.getX(i)*4+time,
			     scene.children[2].geometry.attributes.position.getY(i)*4+time,
			     scene.children[2].geometry.attributes.position.getZ(i)*4+time) * 0.02

	scene.children[2].geometry.attributes.position.setX(i, scene.children[2].geometry.attributes.position.getX(i) * (d+1));
	scene.children[2].geometry.attributes.position.setY(i, scene.children[2].geometry.attributes.position.getY(i) * (d+1));
	scene.children[2].geometry.attributes.position.setZ(i, scene.children[2].geometry.attributes.position.getZ(i) * (d+1));
	
    }
	scene.children[2].geometry.attributes.position.needsUpdate = true;
	// objClone.geometry.attributes.position.needsUpdate = true; 

    }
   
    
    light.position.x = Math.sin( time * 6 ) * 0.5 - 2;
    light.position.y = Math.cos( time * 3 ) * 0.75 ;
    light.position.z = Math.cos( time * 7 ) * 0.5 -2;

    
    light.position.x = Math.sin( time * -6 ) * 0.5 - 2;
    light.position.y = Math.cos( time * -3 ) * 0.75 ;
    light.position.z = Math.cos( time * -7 ) * 0.5 -2;

    camera.position.x += ( mouseX - camera.position.x ) * .5 * Math.cos( 0.25 );
    camera.position.y += ( - mouseY - camera.position.y ) * .5;
    
     //camera.rotation.y = Math.cos( time * 0.125 ) *
    camera.lookAt( 0, 0, 16 );
    renderer.render( scene, camera );

    
}


function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 16;
    mouseY = ( event.clientY - windowHalfY ) / 16;
    
}
