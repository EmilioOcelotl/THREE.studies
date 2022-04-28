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

let camera, scene, renderer;
let light, light2;

let obj, objClone;
let gltfBool = false;

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Tone.start().then( (x) => init() );

document.addEventListener( 'mousemove', onDocumentMouseMove );

let loopOf; 
let contAnim = 0; 

const clock = new THREE.Clock();

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
let prueba = false; 
let prueba2 = false; 

//onsetdetector = new MMLLOnsetDetector(); //default threshold 0.34
//console.log(onsetdetector); 
// init();

an1 = new Tone.Analyser('fft', 32 ); 
an1.smoothing = 0.9; 
an2 = new Tone.Analyser('fft', 32 ); 
an2.smoothing = 0.9; 
an3 = new Tone.Analyser('fft', 32 ); 
an3.smoothing = 0.9; 

/*
  mic = new Tone.UserMedia(); // Tendrá que ver con el volumen ? 
  
  mic.open().then(() => {
  mic.connect( an1 ); 
    });
*/ 

/*
fuentes = new Tone.Players({
    "0": "audio/cello.wav",
    "1": "audio/wpa1.wav",
    "2": "audio/wpa2.wav"
}).toDestination();
*/

// console.log(fuentes, "fuentes ajuaaa" ); 
let clonadx;

let coloresMesh; 

let detection; 
let contMesh = 0; 

let fondo = false; 

let promesaToda;

let loader = new GLTFLoader();
var dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/js/draco/' );
loader.setDRACOLoader( dracoLoader );

let meshes = []; 
let arrayPromesas = []; 

scene = new THREE.Scene();

Tone.start().then(function(){

    for(let i = 1; i < 5323; i = i + 10  ){
	arrayPromesas.push( new Promise (function (res, rej){
	    loader.load(
		'glTF_Meshes/'+i+'.gltf', 
		function ( gltf ) {
		    res(gltf.scene.children[0]);
		    // meshes[contAnim] = gltf.scene.children[0];
		    // contAnim++;
		})
	}))
    }
    
    let promesaMeshes = Promise.all(arrayPromesas );
    
    let promesaAudio = new Promise(function(res, rej){
	
	let fuentes;
	
	fuentes = new Tone.Players({
	    "0": "audio/cello.wav",
	    "1": "audio/wpa1.wav",
	    "2": "audio/wpa2.wav"
	}, function(){
	    fuentes.toDestination();
	    fuentes.volume.value = -6; 
	    fuentes.player('0').connect( an1 ); 
	    fuentes.player('1').connect( an2 ); 
	    fuentes.player('2').connect( an3 ); 
	    res(fuentes); 
	})  
    })
    
    let promesaGeneral = Promise.all([promesaMeshes, promesaAudio]);
    
    promesaGeneral.then(function(objetos){
	
	objetos[1].player('0').start();
	objetos[1].player('1').start();
	objetos[1].player('2').start();
	
	setTimeout(() => {
	    meshes = objetos[0]; 
	    // console.log(meshes); 
	    scene.add(meshes[0]); // children 0  
	    clonadx = meshes[0].clone();
	    //Tone.Transport.start();
	    // loopOf.start(0);
	    // console.log(scene);

	    init();
	    gltfBool= true; // hasta que se cargue 
	  
	}, 8239);	
    })
    
})

function init(){
        
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
    
    // scene.background = new THREE.Color(0xffffff); 

    light = new THREE.PointLight( 0xffffff, 1 );
    light.position.set( 0, 0, -2 );
    scene.add( light ); // children 1
    
    light2 = new THREE.PointLight( 0xffffff, 1 );
    light2.position.set( 0, 0, -2 );
    scene.add( light2 ); // children 2
    
    if(gamepads){
	console.log("hay gamepads"); 
    }
    
    part();
    
    // 523 
    
    // let contMesh = 0; 

    /*
    
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
    */
    
    // objeto(); 

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

/*
async function objeto (){
    await sonido(); 
}

function sonido(){

    return new Promise(resolve => {
	setTimeout(() => {
	    dosTres(); 
	    fuentes.player('0').start();
	    fuentes.player('1').start();
	    fuentes.player('2').start();
	}, 10000);

    });
    }

*/

/*

async function dosTres(){
    await ochoSegundos(); 
}

function ochoSegundos(){
    return new Promise(resolve => {
	setTimeout(() => {
	    console.log(meshes); 
	    scene.add(meshes[0]);
	    clonadx = meshes[contMesh].clone(); 
	    //Tone.Transport.start();
	    // loopOf.start(0);
	    // console.log(scene);
	    gltfBool= true; 
	}, 8239);
    });
}

*/

function animate(){
    requestAnimationFrame ( animate );
    render();
}

function render() {

    var time2 = Date.now() * 0.0005;

    // promesaToda.then(function(meshes){

    var pads = navigator.getGamepads();

    if(pads[1]){

	// console.log(pads[1].axes[0]);
	
	camera.position.x += ( (pads[1].axes[0]*50) - camera.position.x ) * .25 * Math.cos( 0.25 );
	camera.position.y += ( - (pads[1].axes[1]*50) - camera.position.y ) * .25;
	camera.position.z +=  ( (pads[1].axes[3]*20) - camera.position.z ) * .25 * Math.cos( 0.25 );
	
	if( pads[1].buttons[7].pressed ){

	    if( contMesh == meshes.length ){
		contMesh = 0;
		console.log("reseteo");
		// loopOf.stop(); 
	    }
	    
	    // console.log("holaaaaa");

	    scene.remove(meshes[contMesh]); 
	    contMesh++;
	    meshes[contMesh].scale.x = 16;
	    meshes[contMesh].scale.y = 16;
	    meshes[contMesh].scale.z = 16;
	    meshes[contMesh].rotation.y = Math.PI;
	    meshes[contMesh].material.roughness = 0.2; 
	    meshes[contMesh].material.metalness = 0.2; 	
	    // clonadx = meshes[contMesh].clone(); 
	    scene.add(meshes[contMesh]);    
	}

	if( pads[1].buttons[6].pressed ) {
	    fondo = !fondo;
	    if(fondo){
		scene.background = new THREE.Color(0xffffff); 
	    } else {
		scene.background = new THREE.Color(0x000000); 
	    }
	}
    }
    
    // controls.rotation.x = pads[1].axes[0] * 100  ;
    // camera.rotation.y = Math.cos(pads[1].axes[1])  ;
    
    if(gltfBool){

	
	aButton = true; 
    	for(let i = 0; i < scene.children[3].geometry.attributes.position.count; i++){
		meshpX[i] = clonadx.geometry.attributes.position.getX(i);
		meshpY[i] = clonadx.geometry.attributes.position.getY(i);
		meshpZ[i] = clonadx.geometry.attributes.position.getZ(i);
	    }

	scene.children[3].geometry.attributes.color.needsUpdate = true;

	for(let i = 0; i < scene.children[3].geometry.attributes.color.count; i++){
		
		scene.children[3].geometry.attributes.color.setXYZ(i,
								  coloresMesh.children[1].geometry.attributes.color.getX(i),
								  coloresMesh.children[1].geometry.attributes.color.getY(i),
								  coloresMesh.children[1].geometry.attributes.color.getZ(i));   		    

	}  

	/////////////// MESH 

	const time = Date.now() * 0.0005;
	const delta = clock.getDelta();
	
	let perlin = new ImprovedNoise();
 
	scene.children[0].geometry.computeVertexNormals(); 
	// let perlin = new ImprovedNoise();
 
	for( var i = 0; i < scene.children[0].geometry.attributes.position.count; i++){
	    let d = perlin.noise(scene.children[0].geometry.attributes.position.getX(i)*2+time,
				 scene.children[0].geometry.attributes.position.getY(i)*2+time,
				 scene.children[0].geometry.attributes.position.getZ(i)*2+time ) * 0.025
	    
	    scene.children[0].geometry.attributes.position.setX(i, meshpX[i] * (d+1));
	    scene.children[0].geometry.attributes.position.setY(i, meshpY[i] * (d+1));
	    scene.children[0].geometry.attributes.position.setZ(i, meshpZ[i] * (d+1));

	}
    
	scene.children[0].geometry.attributes.position.needsUpdate = true;
    	scene.children[0].geometry.computeVertexNormals(); 

	////////////////// PARTICULAS 
	
	for( var i = 0; i < scene.children[3].geometry.attributes.position.count; i++){
	   	    
	    let d = perlin.noise(scene.children[3].geometry.attributes.position.getX(i)*(Tone.dbToGain(an1.getValue()[i%32] )*700)+time,
				 scene.children[3].geometry.attributes.position.getY(i)*(Tone.dbToGain(an2.getValue()[i%32] )*700)+time,
				 scene.children[3].geometry.attributes.position.getZ(i)*(Tone.dbToGain(an3.getValue()[i%32] )*700)+time) * 1	    
	    
	    scene.children[3].geometry.attributes.position.setX(i,  (d+1) * pX[i] ) 
	    scene.children[3].geometry.attributes.position.setY(i,  (d+1) * pY[i] ) ;
	    scene.children[3].geometry.attributes.position.setZ(i,  (d+1) * pZ[i] ) ;
	    
	    
	}
	
	scene.children[3].geometry.attributes.position.needsUpdate = true;
    }

	//camera.position.x = Math.sin( time * 0.25 ) * ( 75 + Math.sin( time * 0.5 )* 10); 
	//camera.position.y = Math.cos( time * 0.25 ) * 10; 
	// camera.position.z = Math.cos( time * 0.25 ) * - 10;     
	
	//camera.position.x += ( mouseX - camera.position.x ) * .25 * Math.cos( 0.25 );
	// camera.position.y += ( - mouseY - camera.position.y ) * .25;
	
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
