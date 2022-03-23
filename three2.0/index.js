
import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from '/jsm/loaders/OBJLoader.js';
import { DRACOLoader } from '/jsm/loaders/DRACOLoader.js';

const startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init );

let camera, scene, renderer;
let light, light2;

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
    
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
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
	'cap/0000000.gltf',
	function ( gltf ) {
	    
	    //fuente.position.set(0, 0, 40)

	    gltf.scene.rotation.y = Math.PI;

	    gltf.scene.position.z = -1;
	    
	    gltf.scene.position.x = 0.1;

	    gltf.scene.children[0].material.metalness = 0.5;
	    
	    gltf.scene.children[0].material.roughness = 0.1; 

	    scene.add( gltf.scene  )
	    render();

	    console.log(gltf.scene.children[0].geometry.attributes.position.length);

	    console.log(gltf.scene.children[0]);
	    
	    
	    // Scene.fuente = fuente
	    
	    //var animations = gltf.animations;
	    
	    //mixer = new THREE.AnimationMixer( fuente );
	    
	    //var action = mixer.clipAction( animations[ 0 ] );
	    //action.play();
	    
	    // capt00.fuente = fuente;
	    
	})

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
    
    animate();
    
}

function animate(){
    requestAnimationFrame ( animate );
    render();
}

function render() {

    const time = Date.now() * 0.0005;
    const delta = clock.getDelta();
    
    light.position.x = Math.sin( time * 6 ) * 0.5 - 2;
    light.position.y = Math.cos( time * 3 ) * 0.75 ;
    light.position.z = Math.cos( time * 7 ) * 0.5 -2;

    
    light.position.x = Math.sin( time * -6 ) * 0.5 - 2;
    light.position.y = Math.cos( time * -3 ) * 0.75 ;
    light.position.z = Math.cos( time * -7 ) * 0.5 -2;

    camera.lookAt( scene.position );
    renderer.render( scene, camera );

    
}
