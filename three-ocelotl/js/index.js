// "use strict";
import * as THREE from '/js/three/build/three.module.js';
import {PointerLockControls} from '/js/three/examples/jsm/controls/PointerLockControls.js';
import {OrbitControls} from '/js/three/examples/jsm/controls/OrbitControls.js'; 
import {ImprovedNoise} from '/js/three/examples/jsm/math/ImprovedNoise.js'; 

//import * as THREE from '../build/three.module.js';
//import { PointerLockControls } from './jsm/controls/PointerLockControls.js';

let camera, camera2, scene, sceneR, renderer, controls;
let analyser, analyser2, analyser3; 
let pX = [];
let pY = [];
let pZ = []; 
let bamboo = [];

const objects = [];
const part = [];
let meshS, meshS2, meshS3; 

let clight1, clight2, clight3, clight4;
let algo;
    
let clight1R, clight2R, clight3R, clight4R; 
        
let raycaster;
let cubeRenderTarget, cubeCamera; 

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

const noise = new perlinNoise3d();

const startButton = document.getElementById( 'startButton' );

startButton.addEventListener( 'click', init );

let noiseStep; 

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let sliderPos = window.innerWidth / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove );

function isMobile() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    return isAndroid || isiOS;
}

const mobile = isMobile();
const perlin = new ImprovedNoise(); // pase esto al inicio, si no funciona, va en animate

let plane2; 
// init();
// animate();
let video = document.getElementById( 'video' );

let contador = 0; 

function init() {

    const overlay = document.getElementById( 'overlay' );
    overlay.remove();

    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );
    instructions.remove(); 
    blocker.remove();

    const cuadrito = document.getElementById( 'cuadrito' );
    cuadrito.style.display = 'block';


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    // camera.position.y = 10;
    
    camera.position.x = 100;
    camera.position.z = 100;

    camera.lookAt(200, 0, 0); 
    
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(  0x000000 );

    sceneR = new THREE.Scene();
    //scene.background = new THREE.Color( 0x000000 );

    //scene.background = new THREE.Color( 0xff0000 );
    
    controls = new OrbitControls( camera, renderer.domElement );
    controls.maxDistance = 300;


    const path = 'img/';
    const format = '.png';
    const urls = [
	path + 'px' + format, path + 'nx' + format,
	path + 'py' + format, path + 'ny' + format,
	path + 'pz' + format, path + 'nz' + format
    ];
    
    const reflectionCube = new THREE.CubeTextureLoader().load( urls );
    const refractionCube = new THREE.CubeTextureLoader().load( urls );
    refractionCube.mapping = THREE.CubeRefractionMapping;
    
    //scene = new THREE.Scene();
    //scene.background = reflectionCube;
    // sceneR.background = reflectionCube; 
    ////////////////////////////////////////////////////

    const geometry2 = new THREE.PlaneGeometry( 192*2, 108*2 );
    const material2 = new THREE.MeshBasicMaterial( {color: 0xffffff,
						    side: THREE.DoubleSide,
						    //roughness: 0.99,
						    // metalness: 0.1
						    depthTest: false
						   } );

    material2.map = new THREE.VideoTexture( video );

    plane2 = new THREE.Mesh( geometry2, material2 );
    sceneR.add( plane2 );
    // sceneR.add(plane2); 
    plane2.renderOrder = 10000;

    let rojo = new THREE.Color( 0x711c91 );
    let verde = new THREE.Color( 0xea00d9 ); 
    let azul = new THREE.Color( 0x0adbc6 ); 
    let morado = new THREE.Color( 0x133e7c ); 
    let blanco = new THREE.Color ( 0xffffff); 

   
    clight1 = new THREE.PointLight(blanco, 0.5)
    clight2 = new THREE.PointLight(blanco, 0.5)
    clight3 = new THREE.PointLight(blanco,0.5)
    clight4 = new THREE.PointLight(blanco, 0.5)

    /*
    clight1 = new THREE.PointLight(blanco, 0.2)
    clight2 = new THREE.PointLight(blanco, 0.2)
    clight3 = new THREE.PointLight(blanco, 0.2)
    clight4 = new THREE.PointLight(blanco, 0.2)
*/

    scene.add( clight1 )
    scene.add( clight2 )
    scene.add( clight3 )
    scene.add( clight4 )


    const pilaresMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: refractionCube, refractionRatio: 0.95 } );
/*
    let pilaresMaterial = new THREE.MeshStandardMaterial( {
	color: 0xffffff,
	// refractionRatio: 0.75
	roughness: 0.4,
	metalness: 0.4
    } );
*/
    
    const pilargeom = new THREE.BoxGeometry(2, 1800, 2);

    let loc = 0;
    
    for(let k=0; k<18;k++){
	for(let i=1;i<6;i++){

	    bamboo[loc] = new THREE.Mesh(pilargeom, pilaresMaterial )
	    // bamboo[loc].rotation.set((Math.random()- 1 )/2, 0, (Math.random()-1)/2)
	    bamboo[loc].rotation.set((Math.random()- 0.5 )/4, 0, (Math.random()-0.5)/4)

	    let ang = (k * 10 + ((i+1)%3)* 3 + i) * 2 * Math.PI/180
	    let r1 = 20 + 45*i
	    let r2 = 20 + 50*i
	    
	    bamboo[loc].position.set(r1 * Math.sin(ang), 10, r2 *Math.cos(ang) )
	    scene.add(bamboo[loc])
	     //sceneR.add(bamboo[loc])
	    loc++; 
	}
    }

    const geometry = new THREE.SphereGeometry( 10, 1, 2 );

  
    const material = new THREE.MeshStandardMaterial( {
	color: 0xffffff,
	side: THREE.DoubleSide,
	//envMap: scene.background,
	refractionRatio: 0.7,
	roughness: 0.1,
	metalness: 0.9,
	envMap: refractionCube
    } );
   

  //   const material= new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.6, refractionRatio: 0.99 } );


    
	// const d = perlin.noise(i * 1); 

    for( var i = 0; i < 4096; i++){
	    
	part[i] = new THREE.Mesh(geometry, material); 
	var posX, posY, posZ;
	
	var theta1 = Math.random() * (Math.PI*2);
	var theta2 = Math.random() * (Math.PI*2); 

	posX = Math.cos(theta1) * Math.cos(theta2);
	posY = Math.sin(theta1);
	posZ = Math.cos(theta1) * Math.sin(theta2);

	/*
	const d = perlin.noise(i / 100 * Math.random(), i /100 * Math.random(),  i / 100 * Math.random()); 
	const e = perlin.noise(i / 100 * Math.random(), i /100 * Math.random(),  i / 100 * Math.random()); 

	console.log(Math.abs(d) * 100); 
	
	*/ 
	let radio = 50;
	
	pX[i] = posX * radio ; 
	pY[i] = posY * radio ;
	pZ[i] = posZ * radio ; 
	
	//pX[i] = Math.random() * 20 -10 ;
	//pY[i] = Math.random() * 20 -10 ;
	//pZ[i] = Math.random() * 20 -10 ;

	part[i].position.x = pX[i];
	part[i].position.y = pY[i];
	part[i].position.z = pZ[i];		    
	
	part[i].rotation.x = Math.PI * Math.random(); 
	part[i].rotation.y = Math.PI * Math.random(); 
	part[i].rotation.z = Math.PI * Math.random();

	part[i].scale.x = Math.random() * 0.125 ; 
	part[i].scale.y = Math.random() * 0.125 ; 
	part[i].scale.z = Math.random() * 0.125 ; 
	
	scene.add( part[i] );

    }

    let fftSize = 512; 
    const listener = new THREE.AudioListener();
    camera.add( listener );

    const audio = new THREE.PositionalAudio(listener);
    const audio2 = new THREE.PositionalAudio(listener); 
    const audio3 = new THREE.PositionalAudio(listener); 

    const audioElement = document.getElementById( 'in' );
    audioElement.play();

    audio.setMediaElementSource( audioElement );
    audio.setRefDistance( 2000 );
    audio.setVolume( 1 ); 
    //audio.setDirectionalCone( 180, 230, 0.1 );

    const audioElement2 = document.getElementById( 'wpa1' );
    audioElement2.play();

    audio2.setMediaElementSource( audioElement2 );
    audio2.setRefDistance( 2000 );
    audio2.setVolume( 1 ); 
    //audio2.setDirectionalCone( 180, 230, 0.1 );
    
    const audioElement3 = document.getElementById( 'wpa2' );
    audioElement3.play();

    audio3.setMediaElementSource( audioElement3 );
    audio3.setRefDistance( 2000 );
    audio3.setVolume( 1 ); 
    //audio3.setDirectionalCone( 180, 230, 0.1 );
    
    
    video.play(); 

    //audio.setMediaElementSource(  document.getElementById( 'music' ) );
    // audio.play(); 
    //const audioElement = document.getElementById( 'music' );
    // audioElement.play();

    // let audio;

    // const audio = new THREE.Audio( listener );

    /*
    const audioLoader = new THREE.AudioLoader();
	  
    audioLoader.load( 'sounds/in.mp3', function( buffer ) {
      
	audio.setBuffer( buffer );

	audio.setLoop( true );
	audio.setRefDistance( 2000 );
	audio.setVolume( 1 );
	audio.play();

    });

    const audioLoader2 = new THREE.AudioLoader();


    audioLoader2.load( 'sounds/wpa1.mp3', function( buffer ) {
	audio2.setBuffer( buffer );
	audio2.setLoop( true );
	audio2.setRefDistance( 2000 );
	audio2.setVolume( 1 );

	audio2.play();

    });
    
    const audioLoader3 = new THREE.AudioLoader();
    
    audioLoader3.load( 'sounds/wpa2.mp3', function( buffer ) {
	audio3.setBuffer( buffer );
	audio3.setLoop( true );
	audio3.setRefDistance( 2000 );
	audio3.setVolume( 1 );
	audio3.play();

    });
    */


    // const sphereS = new THREE.SphereGeometry( 5, 32, 32 );
    
    const sphereS = new THREE.BoxGeometry( 10, 10, 10 );   
   
    const materialCam = new THREE.MeshStandardMaterial( {
	color: 0xffffff,
	// side: THREE.DoubleSide,
	//envMap: cubeRenderTarget.texture,
	//refractionRatio: 0.95
	roughness: 0.4,
	metalness: 0.8,
    } );


    /*

    const materialCam = new THREE.MeshBasicMaterial( {
	envMap: cubeRenderTarget.texture,
	combine: THREE.MultiplyOperation,
	reflectivity: 1
    } );
    */
    meshS = new THREE.Mesh( sphereS, material );
    meshS2 = new THREE.Mesh( sphereS, material );
    meshS3 = new THREE.Mesh( sphereS, material );

    scene.add( meshS );
    scene.add( meshS2 );
    scene.add( meshS3 );

    meshS.add( audio );
    meshS2.add( audio2 );
    meshS3.add( audio3 ); 

    // meshS.add( cubeCamera ); 

    analyser = new THREE.AudioAnalyser( audio, fftSize); 
    analyser2 = new THREE.AudioAnalyser( audio2, fftSize); 
    analyser3 = new THREE.AudioAnalyser( audio3, fftSize); 

    // Lineas

    const materialL1 = new THREE.LineBasicMaterial({
	color: 0xff0000,
	linewidth: 4,

    });
    
    const points = [];
    points.push( new THREE.Vector3( - 2000, 0, 0 ) );
    points.push( new THREE.Vector3(   2000, 0, 0 ) );
    // points.push( new THREE.Vector3( 1000, 0, 0 ) );
    
    const geometryL = new THREE.BufferGeometry().setFromPoints( points );
    
    const line = new THREE.Line( geometryL, materialL1 );
    // scene.add( line );


    const materialL2 = new THREE.LineBasicMaterial({
	color: 0x00ff00,
	linewidth: 4,
    });
    
    const points2 = [];
    points2.push( new THREE.Vector3( 0, -2000, 0 ) );
    points2.push( new THREE.Vector3( 0, 2000, 0 ) );
    // points.push( new THREE.Vector3( 1000, 0, 0 ) );
    
 const geometryL2 = new THREE.BufferGeometry().setFromPoints( points2 );
    
    const line2 = new THREE.Line( geometryL2, materialL2 );
    // scene.add( line2 );

    const materialL3 = new THREE.LineBasicMaterial({
	color: 0x0000ff,
	linewidth: 4,

    });
    
    const points3 = [];
    points3.push( new THREE.Vector3( 0, 0, 2000 ) );
    points3.push( new THREE.Vector3( 0, 0, -2000 ) );
    // points.push( new THREE.Vector3( 1000, 0, 0 ) );
    
    const geometryL3 = new THREE.BufferGeometry().setFromPoints( points3 );
    
    const line3 = new THREE.Line( geometryL3, materialL3 );
    //scene.add( line3 );

    
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.setScissorTest( true );
    // renderer.setAnimationLoop( render );
				
    // renderer.outputEncoding = THREE.sRGBEncoding; // rendertargetcamera
    document.body.appendChild( renderer.domElement );
    
    //
    
    window.addEventListener( 'resize', onWindowResize);
    initSlider();


    animate(); 

    
}

function onWindowResize() {

    
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    
}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}


function initSlider() {

    const slider = document.querySelector( '.slider' );
    
    function onPointerDown() {
	
	if ( event.isPrimary === false ) return;
	
	controls.enabled = false;
	
	window.addEventListener( 'pointermove', onPointerMove );
	window.addEventListener( 'pointerup', onPointerUp );
	
    }
    
    function onPointerUp() {
	
	controls.enabled = true;
	
	window.removeEventListener( 'pointermove', onPointerMove );
	window.removeEventListener( 'pointerup', onPointerUp );
	
    }
    
    function onPointerMove( e ) {

	if ( event.isPrimary === false ) return;
	
	sliderPos = Math.max( 0, Math.min( window.innerWidth, e.pageX ) );
	
	slider.style.left = sliderPos - ( slider.offsetWidth / 2 ) + "px";
	
    }
    
    slider.style.touchAction = 'none'; // disable touch scroll
    slider.addEventListener( 'pointerdown', onPointerDown );
    
}


function animate() {
    
    requestAnimationFrame( animate );

    var time2 = Date.now() * 0.0005;

    noiseStep = 0;
    
    let data = analyser.getFrequencyData();
    let data2 = analyser2.getFrequencyData();
    let data3 = analyser3.getFrequencyData();

    let t;
    t = Math.min(t + 0.01, 1);

    let rand1 = [];
    let rand2 = [];
    let rand3 = [];

    let hola;

    plane2.lookAt( camera.position ); 
    // plane2.position.x = camera.position.x;
    
    plane2.rotation.y = -Math.cos( time2 * 0.125 ) * 0.001; 
    // plane2.position.y = -plane2.position.y; 
    // plane2.rotation.z = -camera.rotation.z * 0.001; 
    // plane2.position.y += -( - mouseY - camera.position.y ) * .5;

    // plane2.position.y = camera.position.y;
    // plane2.position.z = camera.position.z -100;

    // plane2.rotation.y = Math.cos( time2 * 0.125 ) * 0.001; 
    // plane2.position.z = -Math.cos( time2 * 0.25 ) * - 100; 
      
    for(let i = 0; i < 4096; i++){

	hola = noise.get(noiseStep) * 1;
	 const rraand= Math.random() 
	let d, e, f; 
	d = perlin.noise(pX[i]* 0.001 + time2 , pY[i], pZ[i]) * 8; 

	// console.log(d); 
	//part[i].position.x = pX[i] * (data [i%128]*10000) + hola - 25;
	part[i].position.x = lerp(pX[i], pX[i] * (data[i%64]*800), 0.0001)*d  ; 
	// part[i].position.x = lerp(pX[i], pX[i] * (data  [i%64]*2000), 0.0001) ; 
	part[i].position.y = lerp(pY[i], pY[i] * (data2 [i%64]*800), 0.0001) *d; 
	part[i].position.z = lerp(pZ[i], pZ[i] * (data3 [i%64]*800), 0.0001) *d; 

	//part[i].position.x = pX[i] * (1+data [i%512] /2) ;
	//part[i].position.y = pY[i] * (1+data2[i%512] /2); 
	// part[i].position.z = pZ[i] * (1+data3[i%512] /2) ;

	part[i].rotation.x += (data[i%32]/3000);
	part[i].rotation.y += (data2[i%32] /4000); 
	part[i].rotation.z += (data3[i% 32]/ 2000); 

	part[i].scale.x = 2 * ( data[i%32] / 256); 

	// part[i].scale.y = 0.0125 + 1 * ( data[i%32] / 128); 

	// part[i].scale.z = 0.00125 + 1 * ( data[i%32] / 128); 

    noiseStep = noiseStep + 0.001; 

    }


    /*
    meshS.visible = false;
	    
	   //  edges.moveAudioSphere();

    cubeCamera.position.copy( camera.position );
    cubeCamera.update( renderer, scene );
    meshS.visible = true;
*/ 

    //for(let i = 10; i < 100; i++){
	// bamboo[0].position.x = 10 * (data[i%12]); 
    // }


    controls.update();

    // si no es móvil entonces funciona así el asunto 

    if(!mobile){
	camera.position.x += ( mouseX - camera.position.x ) * .5 * Math.cos( 0.25 );
	camera.position.y += ( - mouseY - camera.position.y ) * .5;
        // impulsos cada cierto tiempo 
    }
    //camera.rotation.x = Math.sin( time2 * 0.25 ) * ( 75 + Math.sin( time2 * 0.5 )* 0.1) * 0.125; 
    camera.rotation.y = Math.cos( time2 * 0.125 ) * 0.001; 
    camera.position.z = Math.cos( time2 * 0.25 ) * - 100; 

    
    // camera.lookAt(400, 0, 0 );


    meshS.position.x = Math.sin( time2 * 0.25 ) * 100
    meshS.position.y = Math.sin( time2 * 0.125 ) * 50
    meshS.position.z = Math.cos( time2 * 0.25 ) * 100
    
    meshS2.position.x = Math.sin( time2 * 0.25 ) * -100
    meshS2.position.y = Math.sin( time2 * 0.125 ) * 50
    meshS2.position.z = Math.cos( time2 * 0.25 ) * -100

    meshS3.position.x = Math.sin( time2 * 0.25 ) * -100
    meshS3.position.y = Math.sin( time2 * 0.125 ) * -50
    meshS3.position.z = Math.cos( time2 * 0.25 ) * 100

    meshS.rotation.x += data[0] / 1000; 
    meshS.rotation.y += data[1] / 1000; 
    meshS.rotation.z += data[2] / 1000; 

    // meshS.scale.x += data[0] / 1000; 
    
    meshS2.rotation.x += data2[0] / 2000; 
    meshS2.rotation.y += data2[1] / 2000; 
    meshS2.rotation.z += data2[2] / 2000; 

    meshS3.rotation.x += data3[0] / 2000; 
    meshS3.rotation.y += data3[1] / 2000; 
    meshS3.rotation.z += data3[2] / 2000; 
    
    clight1.position.x = Math.sin( time2 * 0.7/2 ) * 1400;
    clight1.position.y = Math.cos( time2* 0.5/2 ) * 50;
    clight1.position.z = Math.cos( time2 * 0.3/2 ) * 1400;
	
    clight2.position.x = Math.cos( time2 * 0.3/2 ) * 1400;
    clight2.position.y = Math.sin( time2 * 0.5/2 ) * 50;
    clight2.position.z = Math.sin( time2 * 0.7/2 ) * 1400;
	
    clight3.position.x = Math.cos( time2 * 0.7/2 ) * 1400;
    clight3.position.y = Math.cos( time2 * 0.3/2 ) * 50;
    clight3.position.z = Math.sin( time2 * 0.5/2 ) * 1400;
	
    clight4.position.x = Math.sin( time2 * 0.3/2 ) * 1400;
    clight4.position.y = Math.cos( time2 * 0.7/2 ) * 50;
    clight4.position.z = Math.sin( time2 * 0.5/2 ) * 1400;

    contador++; 
    
    
    const time = performance.now();
    
    prevTime = time;
    
    // renderer.render( scene, camera );

    renderer.setScissor( 0, 0, sliderPos,  window.innerHeight );
    renderer.render( sceneR, camera );
    
    renderer.setScissor( sliderPos, 0, window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );

       
}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;
    
}

/*
function render() {
    
    renderer.setScissor( 0, 0, sliderPos,  window.innerHeight );
    renderer.render( sceneR, camera );
    
    renderer.setScissor( sliderPos, 0, window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
}
*/
