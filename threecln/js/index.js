// "use strict";
import * as THREE from '/js/three/build/three.module.js';
import {PointerLockControls} from '/js/three/examples/jsm/controls/PointerLockControls.js';

//import * as THREE from '../build/three.module.js';

//import { PointerLockControls } from './jsm/controls/PointerLockControls.js';

let camera, scene, renderer, controls;
let analyser; 
let pX = [];
let pY = [];
let pZ = []; 
let bamboo = [];

const objects = [];
const part = [];

let clight1, clight2, clight3, clight4; 
    
let raycaster;

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

init();
animate();

function init() {
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 10;
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
    
    //const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    //light.position.set( 0.5, 1, 0.75 );
    //scene.add( light );
    
    controls = new PointerLockControls( camera, document.body );
    
    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );
    
    instructions.addEventListener( 'click', function () {
	controls.lock();
    }, false );
    
    controls.addEventListener( 'lock', function () {
	
	instructions.style.display = 'none';
	blocker.style.display = 'none';
	
    } );
    
    controls.addEventListener( 'unlock', function () {
	
	blocker.style.display = 'block';
	instructions.style.display = '';
	
    } );
    
    scene.add( controls.getObject() );
    
    const onKeyDown = function ( event ) {
	
	switch ( event.keyCode ) {
	    
	case 38: // up
	case 87: // w
	    moveForward = true;
	    break;
	    
	case 37: // left
	case 65: // a
	    moveLeft = true;
	    break;
	    
	case 40: // down
	case 83: // s
	    moveBackward = true;
	    break;
	    
	case 39: // right
	case 68: // d
	    moveRight = true;
	    break;
	    
	case 32: // space
	    if ( canJump === true ) velocity.y += 350;
	    canJump = false;
	    break;
	    
	}
	
    };
    
    const onKeyUp = function ( event ) {
	
	switch ( event.keyCode ) {
	    
	case 38: // up
	case 87: // w
	    moveForward = false;
	    break;
	    
	case 37: // left
	case 65: // a
	    moveLeft = false;
	    break;
	    
	case 40: // down
	case 83: // s
	    moveBackward = false;
	    break;
	    
	case 39: // right
	case 68: // d
	    moveRight = false;
	    break;
	    
	}
	
    };
    
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
    
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    let rojo = new THREE.Color( 0xaf43be );
    let verde = new THREE.Color( 0xfd8090 ); 
    let azul = new THREE.Color( 0xc4ffff); 
    let morado = new THREE.Color( 0x08deea ); 
    let blanco = new THREE.Color ( 0xffffff); 
    
    clight1 = new THREE.PointLight(rojo, 0.25)
    clight2 = new THREE.PointLight(verde, 0.25)
    clight3 = new THREE.PointLight(azul, 0.25)
    clight4 = new THREE.PointLight(morado, 0.25)
		
    scene.add( clight1 )
    scene.add( clight2 )
    scene.add( clight3 )
    scene.add( clight4 )
    let pilaresMaterial = new THREE.MeshStandardMaterial( {
	color: 0xffffff,
	envMap: scene.background,
	// refractionRatio: 0.75
	roughness: 0.6,
	metalness: 0.8
    } );
    
    const pilargeom = new THREE.BoxGeometry(2, 400, 2);

    let loc = 0;
    
    for(let k=0; k<18;k++){
	for(let i=1;i<2;i++){

	    bamboo[loc] = new THREE.Mesh(pilargeom, pilaresMaterial )
	    // bamboo[loc].rotation.set((Math.random()- 1 )/2, 0, (Math.random()-1)/2)
	    bamboo[loc].rotation.set((Math.random()- 0.5 )/4, 0, (Math.random()-0.5)/4)

	    let ang = (k * 10 + ((i+1)%3)* 3 + i) * 2 * Math.PI/180
	    let r1 = 40 + 45*i
	    let r2 = 40 + 55*i
	    
	    bamboo[loc].position.set(r1 * Math.sin(ang), 10, r2 *Math.cos(ang) )
	    scene.add(bamboo[loc])
	    loc++; 
	}
    }

    const geometry = new THREE.SphereGeometry( 10, 2, 2 );

    const material = new THREE.MeshStandardMaterial( {
	color: 0xffffff,
	// side: THREE.DoubleSide,
	// envMap: scene.background,
	//refractionRatio: 0.95
	roughness: 0.5,
	metalness: 0.8,
    } );

    for( var i = 0; i < 4096; i++){
	
    
	part[i] = new THREE.Mesh(geometry, material); 

	/*
	var posX, posY, posZ;
	
	var theta1 = Math.random() * (Math.PI*2);
	var theta2 = Math.random() * (Math.PI*2); 

	posX = Math.cos(theta1) * Math.cos(theta2);
	posY = Math.sin(theta1);
	posZ = Math.cos(theta1) * Math.sin(theta2);

	pX[i] = posX;
	pY[i] = posY;
	pZ[i] = posZ; 
	Movimiento: WASD

	*/
	
	pX[i] = Math.random() * 200 - 100 ;
	pY[i] = Math.random() * 160 -80 + 10 ;
	pZ[i] = Math.random() * 200 - 100 ;

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
    const audio = new THREE.Audio(listener); 
    //audio.setMediaElementSource(  document.getElementById( 'music' ) );
    // audio.play(); 
    //const audioElement = document.getElementById( 'music' );
    // audioElement.play();

    // const audio = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load( 'sounds/threeFinal.mp3', function( buffer ) {
	audio.setBuffer( buffer );
	audio.setLoop( true );
	// audio.setVolume( 0.5 );
	audio.play();
});
    
    analyser = new THREE.AudioAnalyser( audio, fftSize); 
	
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    //
    
    window.addEventListener( 'resize', onWindowResize, false );
    
}

function onWindowResize() {
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    
}

function animate() {
    
    requestAnimationFrame( animate );

    let data = analyser.getFrequencyData();

    for(let i = 0; i < 4096; i++){
	part[i].position.x = pX[i] * (1+data[128-i%128] /128) ;
	part[i].position.y = pY[i] * (1+data[i%128] / 1024); 
	part[i].position.z = pZ[i] * (1+data[128-i%128] /128) ;

	part[i].rotation.x += (data[i%128]/2000);
	part[i].rotation.y += (data[i%128] /1000); 
	part[i].rotation.z += (data[i% 20]/ 3000); 

	part[i].scale.y = 0.5* ( data[i%128] / 64); 
	
    }

    //for(let i = 10; i < 100; i++){
	// bamboo[0].position.x = 10 * (data[i%12]); 
    // }

    var time2 = Date.now() * 0.0005;

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

    
    const time = performance.now();
    
    if ( controls.isLocked === true ) {
	
	raycaster.ray.origin.copy( controls.getObject().position );
	raycaster.ray.origin.y -= 10;
	
	const intersections = raycaster.intersectObjects( objects );
	
	const onObject = intersections.length > 0;
	
	const delta = ( time - prevTime ) / 1000;
	
	velocity.x -= velocity.x * 10.0 * delta;
	velocity.z -= velocity.z * 10.0 * delta;
	
	velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
	
	direction.z = Number( moveForward ) - Number( moveBackward );
	direction.x = Number( moveRight ) - Number( moveLeft );
	direction.normalize(); // this ensures consistent movements in all directions
	
	if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
	if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
	
	if ( onObject === true ) {
	    
	    velocity.y = Math.max( 0, velocity.y );
	    canJump = true;
	    
	}
	
	controls.moveRight( - velocity.x * delta );
	controls.moveForward( - velocity.z * delta );
	
	controls.getObject().position.y += ( velocity.y * delta ); // new behavior
	
	if ( controls.getObject().position.y < 10 ) {
	    
	    velocity.y = 0;
	    controls.getObject().position.y = 10;
	    
	    canJump = true;
	    
	}
	
    }
    
    prevTime = time;
    
    renderer.render( scene, camera );
    
}
