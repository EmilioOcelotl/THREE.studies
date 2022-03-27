import * as THREE from 'three';
import * as Tone from 'tone';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './jsm/loaders/DRACOLoader.js';
import { ImprovedNoise } from './jsm/math/ImprovedNoise.js'; 

const OSC = require('osc-js'); // pal osc 
const osc = new OSC();
osc.open();

// init();
 
/*
document.querySelector('button').addEventListener('click', async () => {
    // console.log('audio is ready')   
    // await Tone.start();   
    init();
})
*/

let camera, scene, renderer;
let light, light2;

let obj, objClone;
let gltfBool = false;

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove );

let loopOf; 
let contAnim = 0; 

const clock = new THREE.Clock();

// Analizador para audio in y para wpas

let an1, an2, an3; 
let mic;

let pX = [];
let pY = [];
let pZ = []; 

let vertices = []; 
let colores = []; 

let particulas = 4320;
let pMat, pGeo, pointsPart;
let gamepads; 
let controls;

let aButton = false; 

init();

function init(){

    gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        
    document.body.style.cursor = 'none'; 
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
	    objeto(contAnim); 
	    // console.log(obj.children.length );
	})
    
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );
   
    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.update();
    window.addEventListener( 'resize', onWindowResize );

    if(gamepads){
	console.log("hay gamepads"); 
    }
    
    an1 = new Tone.Analyser('fft', 32 ); 
    an1.smoothing = 0.9; 
    
    mic = new Tone.UserMedia(); // Tendrá que ver con el volumen ? 
    
    mic.open().then(() => {
	mic.connect( an1 ); 
    });
    
    part();
    oscSend(); 
    animate();
    
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
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

    var pads = navigator.getGamepads();

    if(pads[1]){
	
	// console.log(pads[1].axes[0]);

	// controls.rotation.x = pads[1].axes[0] * 100  ;
	// camera.rotation.y = Math.cos(pads[1].axes[1])  ;

	camera.position.x += ( (pads[1].axes[0]*100) - camera.position.x ) * .25 * Math.cos( 0.25 );
	camera.position.y += ( - (pads[1].axes[1]*100) - camera.position.y ) * .25;
	camera.position.z +=  ( (pads[1].axes[3]*200) - camera.position.z ) * .25 * Math.cos( 0.25 ); 
	
	if(pads[1].buttons[7].pressed == true){ // algún tipo de protección para que no se repiita

	    aButton = true; 
    
	    if(contAnim > obj.children.length -17 ) { // cuadros malos 
		contAnim = 0;
		console.log("hola"); 		    
	    }
	    
	    scene.remove(scene.children[3]);	    
	    contAnim++;
	    scene.add(obj.children[contAnim].clone() ); 
	    scene.children[3].rotation.y = Math.PI;
	    scene.children[3].position.z = -8;
	    scene.children[3].material.size = 1.1;
	    scene.children[3].scale.x = 32;
	    scene.children[3].scale.y = 32;
	    scene.children[3].scale.z = 32; 
	    
	    scene.children[2].geometry.attributes.color.needsUpdate = true;
	    
	    // esto podría estar asociado a un botón 
	    
	    for(let i = 0; i < scene.children[2].geometry.attributes.color.count; i++){
		
		scene.children[2].geometry.attributes.color.setXYZ(i,
								   scene.children[3].geometry.attributes.color.getX(i),
								   scene.children[3].geometry.attributes.color.getY(i),
								   scene.children[3].geometry.attributes.color.getZ(i));   		    
	    }   
	} else {
	    aButton = false; 
	}
    }
	
    const time = Date.now() * 0.0005;
    const delta = clock.getDelta();
    
    if(gltfBool){
	scene.children[3].geometry.computeVertexNormals(); 
	let perlin = new ImprovedNoise();
	let d = 0; 
	for( var i = 0; i < scene.children[3].geometry.attributes.position.count; i++){
	    d = perlin.noise(scene.children[3].geometry.attributes.position.getX(i)*4+time,
			     scene.children[3].geometry.attributes.position.getY(i)*4+time,
			     scene.children[3].geometry.attributes.position.getZ(i)*4+time) * 0.01	    
	    scene.children[3].geometry.attributes.position.setX(i, scene.children[3].geometry.attributes.position.getX(i) * (d+1));
	    scene.children[3].geometry.attributes.position.setY(i, scene.children[3].geometry.attributes.position.getY(i) * (d+1));
	    scene.children[3].geometry.attributes.position.setZ(i, scene.children[3].geometry.attributes.position.getZ(i) * (d+1));
	    
	}

	scene.children[3].geometry.attributes.position.needsUpdate = true;
	scene.children[3].geometry.computeVertexNormals(); 

	// PARTICULAS ///
	// console.log((Tone.dbToGain(pos[10])) *10000000); 	
	// console.log( Tone.dbToGain(an1.getValue()[0]) *100 ); 
	
	d = 0; 
	
	for( var i = 0; i < scene.children[2].geometry.attributes.position.count; i++){
	    
	    //let pos = an1.getValue();
	    // console.log(Tone.dbToGain(pos[100])); 
	    //console.log(Tone.dbToGain(pos[10])); 

	    d = perlin.noise(scene.children[2].geometry.attributes.position.getX(i)*0.02+time,
			     scene.children[2].geometry.attributes.position.getY(i)*0.02+time,
			     scene.children[2].geometry.attributes.position.getZ(i)*0.02+time) * 4	    
	    scene.children[2].geometry.attributes.position.setX(i, (4+d)* pX[i]  * (Tone.dbToGain(an1.getValue()[i%32] ) * -2000)+1) 
	    scene.children[2].geometry.attributes.position.setY(i, (4+d)* pY[i]  * (Tone.dbToGain(an1.getValue()[i%32] ) * -2000)+1) ;
	    scene.children[2].geometry.attributes.position.setZ(i, (4+d)* pZ[i]  * (Tone.dbToGain(an1.getValue()[i%32] ) * -2000)+1) ;

	}
	
	scene.children[2].geometry.attributes.position.needsUpdate = true;
	
    }
       
    light.position.x = Math.sin( time * 6 ) * 0.5 - 2;
    light.position.y = Math.cos( time * 3 ) * 0.75 ;
    light.position.z = Math.cos( time * 7 ) * 0.5 -2;

    light.position.x = Math.sin( time * -6 ) * 0.5 - 2;
    light.position.y = Math.cos( time * -3 ) * 0.75 ;
    light.position.z = Math.cos( time * -7 ) * 0.5 -2;

    camera.position.x += ( mouseX - camera.position.x ) * .25 * Math.cos( 0.25 );
    camera.position.y += ( - mouseY - camera.position.y ) * .25;
    
     //camera.rotation.y = Math.cos( time * 0.125 ) *
    camera.lookAt( 0, 0, 16 );
    renderer.render( scene, camera );
    
}

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 4;
    mouseY = ( event.clientY - windowHalfY ) / 4;
}

function part(){

    for( var i = 0; i < 4096; i++){

	var posX, posY, posZ;
	
	var theta1 = Math.random() * (Math.PI*2);
	var theta2 = Math.random() * (Math.PI*2); 
	
	posX = Math.cos(theta1) * Math.cos(theta2);
	posY = Math.sin(theta1);
	posZ = Math.cos(theta1) * Math.sin(theta2);
	
	let radio =70; 
	
	pX[i] = posX * radio ; 
	pY[i] = posY * radio ;
	pZ[i] = posZ * radio ; 
	
	vertices.push(posX * radio, posY*radio, posZ*radio+16);
	colores.push(0, 0, 0); 
	    
    }

    pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    pGeo.setAttribute( 'color', new THREE.Float32BufferAttribute( colores, 3 ) );
    pMat = new THREE.PointsMaterial( { color: 0xffffff, vertexColors: true, blending: THREE.AdditiveBlending } );
    pointsPart = new THREE.Points( pGeo, pMat );
    pMat.size = 0.75;
    scene.add( pointsPart );
    
}

function oscSend(){
    osc.on('open', () => {
	setInterval(function(){
	    const message = new OSC.Message('/aButton');
	    message.add( aButton ); 
	    osc.send(message);
	}, 100);
    }); 
}
