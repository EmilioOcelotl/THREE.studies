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

const objects = [];
const part = []; 
    
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

    // scene.background = new THREE.Color( 0xffffff );

    scene.background = new THREE.CubeTextureLoader().setPath('/img/').load([
	'px.jpg',
	'nx.jpg',
	'py.jpg',
	'ny.jpg',
	'pz.jpg',
	'nz.jpg'
    ]);

    // scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
    
    const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );
    
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

    

    // floor
    
    // let floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
    // floorGeometry.rotateX( - Math.PI / 2 );
    
    // vertex displacement
    
    // let position = floorGeometry.attributes.position;

    /*

    for ( let i = 0, l = position.count; i < l; i ++ ) {
	
	vertex.fromBufferAttribute( position, i );
	
	vertex.x += Math.random() * 20 - 10;
	vertex.y += Math.random() * 2;
	vertex.z += Math.random() * 20 - 10;
	
	position.setXYZ( i, vertex.x, vertex.y, vertex.z );
	
    }
    
    floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices
    
    position = floorGeometry.attributes.position;
    const colorsFloor = [];
    
    for ( let i = 0, l = position.count; i < l; i ++ ) {
	
	color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	colorsFloor.push( color.r, color.g, color.b );
	
    }
    
    floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsFloor, 3 ) );
    
    const floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } );
    
    const floor = new THREE.Mesh( floorGeometry, floorMaterial );
    scene.add( floor );

   
    
    // objects
    
    const boxGeometry = new THREE.BoxBufferGeometry( 20, 20, 20 ).toNonIndexed();
    
    position = boxGeometry.attributes.position;
    const colorsBox = [];
    
    for ( let i = 0, l = position.count; i < l; i ++ ) {
	
	color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	colorsBox.push( color.r, color.g, color.b );
	
    }
    
    boxGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsBox, 3 ) );
    
    for ( let i = 0; i < 500; i ++ ) {
	
	const boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: true } );
	boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	
	const box = new THREE.Mesh( boxGeometry, boxMaterial );
	box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
	box.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
	box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
	
	scene.add( box );
	objects.push( box );

    
	
    }
    */
    /*

    const geometry = new THREE.Geometry();

    geometry.vertices.push(
	new THREE.Vector3( -10,  10, 0 ),
	new THREE.Vector3( -10, -10, 0 ),
	new THREE.Vector3(  10, -10, 0 )
    );

    
    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geometry.computeBoundingSphere();
    */

    const geometryC = new THREE.BoxGeometry( 800, 800, 800 );
    const materialC = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide } );
    const cube = new THREE.Mesh( geometryC, materialC );
    // cube.scale.x = 100; 
    // scene.add( cube );


    const geometry = new THREE.SphereGeometry( 10, 4, 4 );

    const material = new THREE.MeshBasicMaterial( {
	color: 0xffffff,
	// side: THREE.DoubleSide,
	envMap: scene.background,
	refractionRatio: 0.25
    } );
    
    for( var i = 0; i < 2048; i++){
	
    
	part[i] = new THREE.Mesh(geometry, material); 

	pX[i] = Math.random() * 200 - 100 ;
	pY[i] = Math.random() * 200 - 100 ;
	pZ[i] = Math.random() * 200 - 100 ;

	
	part[i].position.x = pX[i];
	part[i].position.y = pY[i];
	part[i].position.z = pZ[i];		    

	part[i].rotation.x = Math.PI * Math.random(); 
	part[i].rotation.y = Math.PI * Math.random(); 
	part[i].rotation.z = Math.PI * Math.random();
	
	scene.add( part[i] );

    }

    let fftSize = 2048;
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

    for(let i = 0; i < 2048; i++){
	part[i].position.x = pX[i] * (1+data[i%32] / 128);
	part[i].position.y = pY[i] * (1+data[i%32] / 128); 
	part[i].position.z = pZ[i] * (1+data[i%32] / 128);

	part[i].rotation.x += (data[i%10]/1000);
	
	part[i].rotation.y += (data[i%20]/1500); 

	part[i].rotation.z += (data[i%40]/1200); 

    }
    
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
