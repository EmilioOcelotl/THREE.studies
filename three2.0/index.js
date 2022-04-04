import * as THREE from 'three';
import * as Tone from 'tone';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './jsm/loaders/DRACOLoader.js';
import { ImprovedNoise } from './jsm/math/ImprovedNoise.js'; 

/*
const OSC = require('osc-js'); // pal osc 
const osc = new OSC();
osc.open();
*/ 

/* 
document.querySelector('button').addEventListener('click', async () => {
    // console.log('audio is ready')   
    await Tone.start();   
    init();
})
*/

// init();

let camera, scene, renderer;
let light, light2;

let obj, objClone;
let gltfBool = false;

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

Tone.start().then( (x) => init() );

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

let fuentes;

let meshpX = [];
let meshpY = [];
let meshpZ = []; 

var onsetdetector;

onsetdetector = new MMLLOnsetDetector(); //default threshold 0.34

console.log(onsetdetector); 

// init();

// fuentes.player("2").start(5);

an1 = new Tone.Analyser('fft', 32 ); 
an1.smoothing = 0.8; 

an2 = new Tone.Analyser('fft', 32 ); 
an2.smoothing = 0.99; 

an3 = new Tone.Analyser('fft', 32 ); 
an3.smoothing = 0.99; 

/*
  mic = new Tone.UserMedia(); // Tendrá que ver con el volumen ? 
  
  mic.open().then(() => {
  mic.connect( an1 ); 
    });
*/ 

fuentes = new Tone.Players({
    "0": "audio/cello.wav",
    "1": "audio/wpa1.wav",
    "2": "audio/wpa2.wav"
}).toDestination();

fuentes.player('0').connect( an1 ); 
fuentes.player('1').connect( an2 ); 
fuentes.player('2').connect( an3 ); 

fuentes.volume.value = -6; 
let clonadx;

let meshes = []; 
let coloresMesh; 

let detection; 

function init(){
    
    let loader = new GLTFLoader();
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/js/draco/' );
    loader.setDRACOLoader( dracoLoader );

    for(let i = 1; i < 5323; i = i + 20  ){
	loader.load(
	    'glTF_Meshes/'+i+'.gltf', 
	    function ( gltf ) {
		meshes[contAnim] = gltf.scene.children[0];
		contAnim++;
	    })	
    }

    loader.load(
	 'cap/2022-03-22--20-32-39.gltf',
	//  'cap/0000000.gltf',
	//'cap/prueba.glb', 
	function ( gltf ) {
	    //fuente.position.set(0, 0, 40)
	    coloresMesh = gltf.scene.children[0];
	    // objeto(contAnim); 
	    // console.log(obj.children.length );
	})

    console.log(coloresMesh); 
    
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
    camera.position.set( 0, 0, -4 );
    
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff); 

    light = new THREE.PointLight( 0xffffff,1 );
    light.position.set( 0, 0, -2 );
    scene.add( light );
    
    light2 = new THREE.PointLight( 0xffffff, 1 );
    light2.position.set( 0, 0, -2 );
    scene.add( light2 );
    
    if(gamepads){
	console.log("hay gamepads"); 
    }
    	        
    /*
    mic = new Tone.UserMedia(); // Tendrá que ver con el volumen ? 
    
    mic.open().then(() => {
	mic.connect( an1 ); 
    });
    */ 
    // fuentes.volume.value = -6; 

    part();
    
    // 523 
    

    // console.log(meshes[1]); 
	    // scene.add(meshes[0]);
    
    /*
    loader.load(
	  'cap/0000000.gltf', 
	function ( gltf ) {
	    gltfBool = true;
	    scene.add(gltf.scene.children[0]); 
	    objeto(); 
	    clonadx = scene.children[3].clone(); 
	    obj.scale.x = 4;
	    obj.scale.y = 4;
	    obj.scale.z = 4;
	    obj.rotation.y = Math.PI;
	})
    */

    let contMesh = 0; 
    
    loopOf = new Tone.Loop((time) => {

	if(contMesh == meshes.length){
	    contMesh = 0;
	    console.log("reseteo");
	    loopOf.stop(); 
	}

	scene.remove(meshes[contMesh]); 
	contMesh++;
	meshes[contMesh].scale.x = 16;
	meshes[contMesh].scale.y = 16;
	meshes[contMesh].scale.z = 16;
	meshes[contMesh].rotation.y = Math.PI;
	meshes[contMesh].material.roughness = 0.2; 
	meshes[contMesh].material.metalness = 0.2; 
		
	clonadx = meshes[contMesh].clone(); 

	scene.add(meshes[contMesh]); 
	
    }, "0.77");
    
    objeto(); 

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
    // oscSend(); 
    animate();

    

    
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

async function objeto (){

    // console.log(obj);

    await sonido(); 
    
}

// Más tiempo para la animación

function sonido(){

    return new Promise(resolve => {
	setTimeout(() => {

	    dosTres(); 
	    
	    fuentes.player('0').start();
	    fuentes.player('1').start();
	    fuentes.player('2').start();
	    
	}, 30000);

    });
}

async function dosTres(){
    await ochoSegundos(); 
}

function ochoSegundos(){
       return new Promise(resolve => {
	setTimeout(() => {

	    console.log(meshes); 
	    scene.add(meshes[1]);

	    Tone.Transport.start();
	    loopOf.start(0);
	    console.log(scene);
	    gltfBool= true; 
	    
	}, 8239);

    });
}

function animate(){
    requestAnimationFrame ( animate );
    render();
}

function render() {


    // console.log(scene.children[3]); 
    var pads = navigator.getGamepads();

    // console.log(pads);

    /*
    if(pads[1]){

	console.log(pads[1].axes[0]);
	camera.position.x += ( (pads[1].axes[0]*500) - camera.position.x ) * .25 * Math.cos( 0.25 );
	camera.position.y += ( - (pads[1].axes[1]*500) - camera.position.y ) * .25;
	camera.position.z +=  ( (pads[1].axes[3]*500) - camera.position.z ) * .25 * Math.cos( 0.25 ); 

    }

    */
    
    // controls.rotation.x = pads[1].axes[0] * 100  ;
    // camera.rotation.y = Math.cos(pads[1].axes[1])  ;
    
    
    // if(pads[1].buttons[7].pressed == true){ // algún tipo de protección para que no se repiita

    if(gltfBool){
	
	aButton = true; 
    	for(let i = 0; i < scene.children[3].geometry.attributes.position.count; i++){
		meshpX[i] = clonadx.geometry.attributes.position.getX(i);
		meshpY[i] = clonadx.geometry.attributes.position.getY(i);
		meshpZ[i] = clonadx.geometry.attributes.position.getZ(i);
	    }

	scene.children[2].geometry.attributes.color.needsUpdate = true;

	for(let i = 0; i < scene.children[2].geometry.attributes.color.count; i++){
		
		scene.children[2].geometry.attributes.color.setXYZ(i,
								  coloresMesh.children[0].geometry.attributes.color.getX(i),
								  coloresMesh.children[0].geometry.attributes.color.getY(i),
								  coloresMesh.children[0].geometry.attributes.color.getZ(i));   		    
	    }  
    // const time = Date.now() * 0.0005;
    //const delta = clock.getDelta();

	const time = Date.now() * 0.0005;
	const delta = clock.getDelta();
	
	let perlin = new ImprovedNoise();
 
	scene.children[3].geometry.computeVertexNormals(); 
	// let perlin = new ImprovedNoise();
 
	for( var i = 0; i < scene.children[3].geometry.attributes.position.count; i++){
	    let d = perlin.noise(scene.children[3].geometry.attributes.position.getX(i)*(Tone.dbToGain(an1.getValue()[i%32] )*50000)+time,
				 scene.children[3].geometry.attributes.position.getY(i)*(Tone.dbToGain(an1.getValue()[i%32] )*50000)+time,
				 scene.children[3].geometry.attributes.position.getZ(i)*(Tone.dbToGain(an1.getValue()[i%32] )*50000)+time ) * 0.05
	    
	    scene.children[3].geometry.attributes.position.setX(i, meshpX[i] * (d+1));
	    scene.children[3].geometry.attributes.position.setY(i, meshpY[i] * (d+1));
	    scene.children[3].geometry.attributes.position.setZ(i, meshpZ[i] * (d+1));

	}
    
	scene.children[3].geometry.attributes.position.needsUpdate = true;
    	scene.children[3].geometry.computeVertexNormals(); 

	// PARTICULAS ///
	
	for( var i = 0; i < scene.children[2].geometry.attributes.position.count; i++){
	   	    
	    //let pos = an1.getValue();
	    // console.log(Tone.dbToGain(pos[100])); 
	    //console.log(Tone.dbToGain(pos[10])); 

	    let d = perlin.noise(scene.children[2].geometry.attributes.position.getX(i)*(Tone.dbToGain(an1.getValue()[i%32] )*5000)+time,
				 scene.children[2].geometry.attributes.position.getY(i)*(Tone.dbToGain(an2.getValue()[i%32] )*5000)+time,
				 scene.children[2].geometry.attributes.position.getZ(i)*(Tone.dbToGain(an3.getValue()[i%32] )*5000)+time) * 1	    

	    /*
	    scene.children[2].geometry.attributes.position.setX(i,  (d+1) * pX[i]  * (Tone.dbToGain(an1.getValue()[i%32] ) * 200)* 10) 
	    scene.children[2].geometry.attributes.position.setY(i,  (d+1) * pY[i]  * (Tone.dbToGain(an2.getValue()[i%32] ) * 400)*10) ;
	    scene.children[2].geometry.attributes.position.setZ(i,  (d+1) * pZ[i]  * (Tone.dbToGain(an3.getValue()[i%32] ) * 400)*10) ;

*/
	    scene.children[2].geometry.attributes.position.setX(i,  (d+1) * pX[i] ) 
	    scene.children[2].geometry.attributes.position.setY(i,  (d+1) * pY[i] ) ;
	    scene.children[2].geometry.attributes.position.setZ(i,  (d+1) * pZ[i] ) ;

	    
	}
	
	scene.children[2].geometry.attributes.position.needsUpdate = true;
    }

	//camera.position.x = Math.sin( time * 0.25 ) * ( 75 + Math.sin( time * 0.5 )* 10); 
	//camera.position.y = Math.cos( time * 0.25 ) * 10; 
	// camera.position.z = Math.cos( time * 0.25 ) * - 10;     
	
	camera.position.x += ( mouseX - camera.position.x ) * .25 * Math.cos( 0.25 );
	camera.position.y += ( - mouseY - camera.position.y ) * .25;
	
    

    
     //camera.rotation.y = Math.cos( time * 0.125 ) *
    camera.lookAt( 0, 0, 16 );
    renderer.render( scene, camera );
}   

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 8;
    mouseY = ( event.clientY - windowHalfY ) / 8;
}

function part(){

    for( var i = 0; i < 6000; i++){

	var posX, posY, posZ;
	
	var theta1 = Math.random() * (Math.PI*2);
	var theta2 = Math.random() * (Math.PI*2); 
	
	posX = Math.cos(theta1) * Math.cos(theta2);
	posY = Math.sin(theta1);
	posZ = Math.cos(theta1) * Math.sin(theta2);
	
	let radio =24; 
	
	pX[i] = posX * radio ; 
	pY[i] = posY * radio ;
	pZ[i] = posZ * radio ; 
	
	vertices.push(posX * radio, posY*radio, posZ*radio);
	colores.push( 255, 255, 255 ); 
	    
    }

    pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    pGeo.setAttribute( 'color', new THREE.Float32BufferAttribute( colores, 3 ) );
    pMat = new THREE.PointsMaterial( { color: 0xffffff, vertexColors: true } );
    pointsPart = new THREE.Points( pGeo, pMat );
    pMat.size =0.2;
    pointsPart.position.z = 16; 
    scene.add( pointsPart );

    
    
}


/*
function oscSend(){
    osc.on('open', () => {
	setInterval(function(){
	    const message = new OSC.Message('/aButton');
	    message.add( aButton ); 
	    osc.send(message);
	}, 100);
    }); 
}
*/
