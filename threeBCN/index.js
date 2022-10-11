// Hay una zona que está repetida

// import * as Tone from 'tone';
import * as THREE from 'three';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './jsm/loaders/DRACOLoader.js';
import { ImprovedNoise } from './jsm/math/ImprovedNoise.js';
import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './jsm/postprocessing/UnrealBloomPass.js';
import { OBJLoader } from './jsm/loaders/OBJLoader.js';
import { ShaderPass } from './jsm/postprocessing/ShaderPass.js';
import { CopyShader } from './jsm/shaders/CopyShader.js';
import { FXAAShader } from './jsm/shaders/FXAAShader.js';
import { GUI } from './jsm/libs/lil-gui.module.min.js';
const osc2 = new OSC();
osc2.open();

let webaudio;
var audioblocksize = 256; // la latencia como forma de vida 
let primera = 0; 
let gamepads;
var params = {recordingSize:0.1};
let mute = false; 
// Var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioCtx = new AudioContext();
const dest = audioCtx.createMediaStreamDestination();
const mediaRecorder = new MediaRecorder(dest.stream);
let microphone; 

// let gainNode1, gainNode2, gainNode3; 

let source, request, gainNode, randomNum, sz, strt, flduration; 
let source2, request2, gainNode2, randomNum2, sz2, strt2, flduration2; 
let source3, request3, gainNode3, randomNum3, sz3, strt3, flduration3; 

// Contexto de audio 

//  var audioCtx = window.AudioContext || window.webkitAudioContext;
// const audioContext = new AudioContext();

// document.body.style.cursor = 'none'; // cursor 
// let audioCtx = new window.AudioContext();

let renderer2, scene, camera, composer, controls, container; 
let cube, ring, ring2, ring3;
let switchHydra = 0, switchModel = 0; 
let player; 
let fftN = 64; 
let analyser, analyser2; 
let object; 
let bufferLength, dataArray, bufferLength2, dataArray2;

let texture;
let dpr = window.devicePixelRatio; 
let textureSize = 1024 * dpr;
const vector = new THREE.Vector2();

let materialC2;
let audioSphere; 
let cuboGrande, cuboGrandeCopy; 
let sph; 

let retroBool = true;
// let gamepads; 

let retroEsfera = false;
let retroCubos = true; 

let light1, light2, light3, light4; 

let bamboo = []; 

let cubos = [];

let pX = [], pY = [], pZ = []; 

// let mX = 1000, mY = 10; 

let osci=10, kal=5, voro=5, vorvel=0.5, ang=10, rotvel=0.1, mod=1000, scl = 0.49, sclX = 1.05, sclY = 0.95, sat = 1, colorHydra = 1;  

let total = 1024;

var hydra = new Hydra({
    canvas: document.getElementById("myCanvas"),
    detectAudio: false,
    //makeGlobal: false
}) // antes tenía .synth aqui 

const audioElement = document.getElementById("cello");
let track; 

const elCanvas = document.getElementById( 'myCanvas');
elCanvas.style.display = 'none';     
let vit = new THREE.CanvasTexture(elCanvas);

let an, mic; 
let anSphere = false, anObject = false; 
let vertices = []; 
let boolMesh = true; 
let meshFinal; 
let rocas;
let velocidadCubos = 0; 
let velocidadEnt = 1; 
let material;
let megamesh; 

const fixButton = document.getElementById( 'fixButton' );
fixButton.addEventListener( 'click', init );

// Queda pendiente el otro botón 

function init(){

    webaudio = new MMLLWebAudioSetup(audioblocksize,2,callback,setup); 
    gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);

    if(gamepads){
	console.log("hay gamepads"); 
    }
 
    // audio(); 
    
    const overlay = document.getElementById( 'overlay' );
    overlay.remove();

    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );
    instructions.remove(); 
    blocker.remove();
    
    container = document.getElementById( 'container' );
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 0.1, 3000 );

    // camera.position.z = 10; 
    // scene.fog = new THREE.Fog(0x000000, 10, 960);

    retro();

    scene.background = new THREE.Color( 0x000000 ); 
    
    const geometry = new THREE.SphereGeometry(96, 2, 3 );
    // Buffergeometry 
    // console.log(geometry.attributes.position); 
    material = new THREE.MeshBasicMaterial( { color: 0xffffff, map:texture } );

    for(let i = 0; i < total; i++){
  
	cubos[i] = new THREE.Mesh( geometry, material );

	var posX, posY, posZ;
	var theta1 = Math.random() * (Math.PI*2);
	var theta2 = Math.random() * (Math.PI*2); 
	posX = Math.cos(theta1) * Math.cos(theta2)*1;
	posY = Math.sin(theta1)*1;
	posZ = Math.cos(theta1) * Math.sin(theta2)*1;
	pX[i] = posX;
	pY[i] = posY;
	pZ[i] = posZ; 
	cubos[i].position.x = pX[i] * 200; 
	cubos[i].position.y = pY[i] * 200;
	cubos[i].position.z = pZ[i] * 200;
	cubos[i].rotation.x = Math.random() * 360; 
	cubos[i].rotation.y = Math.random() * 360; 
	cubos[i].rotation.z = Math.random() * 360; 
	// scene.add( cubos[i] );	
    }

    
    materialC2 = new THREE.MeshBasicMaterial( {
	map: vit,
	side: THREE.DoubleSide,
    } );

    const materialDoble = new THREE.MeshBasicMaterial( {
	color: 0xffffff,
	map:texture,
	side: THREE.DoubleSide} );

    const megacubo = new THREE.BoxGeometry(2500, 2500, 2500);
    megamesh = new THREE.Mesh( megacubo, materialDoble );
    scene.add(megamesh); 
   
    const sphGeom = new THREE.SphereGeometry( 20, 64, 64 );
    sph = new THREE.Mesh(sphGeom, materialC2); 
    
    audioSphere = new THREE.SphereGeometry( 2000, 128, 128 );
    audioSphere.usage = THREE.DynamicDrawUsage;
	
    audioSphere.computeBoundingBox();	  
  
    cuboGrande = new THREE.Mesh(audioSphere, materialC2 );
    cuboGrandeCopy = new THREE.Mesh(audioSphere.clone(), materialC2 );

    // materialC2.depthTest = false; 
    cuboGrande.geometry.usage = THREE.DynamicDrawUsage;
	    
    scene.add(cuboGrande);
    
    let pilaresMaterial = new THREE.MeshBasicMaterial( {
	color: 0x000000,
    } );

    for(let i = 0; i < total; i++){
	scene.add(cubos[i]); 
    }
    
    const pilargeom = new THREE.BoxGeometry(1 , 2000, 1 );

    let loc = 0;
     for(let k=0; k<32;k++){
	for(let i=0;i<32;i++){

	    bamboo[loc] = new THREE.Mesh(pilargeom, pilaresMaterial )
	    // bamboo[loc].rotation.set((Math.random()- 1 )/2, 0, (Math.random()-1)/2)
	    bamboo[loc].rotation.set((Math.random()- 0.5 )/2, 0, (Math.random()-0.5)/2)

	    let ang = (k * 10 + ((i+1)%3)* 3 + i) * 2 * Math.PI/100
	    let r1 = 180 + 100*i
	    let r2 = 180 + 110*i
	    
	    bamboo[loc].position.set(r1 * Math.sin(ang), 10, r2 *Math.cos(ang) )
	    bamboo[loc].scale.y = Math.random() * 100+ 10; 
	    scene.add(bamboo[loc])
	    loc++; 
	}
    }
    
    camera.position.z = 50;

    renderer2 = new THREE.WebGLRenderer({antialias: true});
    renderer2.autoClear = false;
    renderer2.setPixelRatio( window.devicePixelRatio );

    // renderer2 = new THREE.WebGLRenderer();
    renderer2.setSize( container.offsetWidth, container.offsetHeight );
    container.appendChild( renderer2.domElement );

    //renderer2.setSize( window.innerWidth, window.innerHeight );
    // document.body.appendChild( renderer2.domElement ); 

    window.addEventListener( 'resize', onWindowResize);
    
    const renderScene = new RenderPass( scene, camera );
    renderScene.clearColor = new THREE.Color( 0, 0, 0 );
    renderScene.clearAlpha = 0;
    
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( container.innerWidth, container.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = 0.9;
    bloomPass.strength = 0.4; // parametrizable 
    bloomPass.radius = 0.8;

    /*
    let fxaaPass = new ShaderPass( FXAAShader );
    const pixelRatio = container.getPixelRatio;

    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
    fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );
    */

    composer = new EffectComposer( renderer2 );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );
    //composer.addPass( fxaaPass );

    controls = new OrbitControls( camera, renderer2.domElement );
    controls.maxDistance = 300;

    swHydra(0);
        
    score();
    // createPanel(); 
    // rocas.start();
    // source.start(0);
    // source2.start(0);
    // source3.start(0); 

    // console.log(navigator.mediaDevices);

    
    // const audioCtx = new AudioContext();
    if (navigator.mediaDevices) {
	navigator.mediaDevices.getUserMedia({"audio": true}).then((stream) => {

	    microphone = audioCtx.createMediaStreamSource(stream);
	    console.log("hay mic");
	    
	    samples();
	    animate(); 	    
	    // `microphone` can now act like any other AudioNode
	}).catch((err) => {
	    // browser unable to access microphone
	    // (check to see if microphone is attached)
	});
    } else {
	// browser unable to access media devices
	// (update your browser)
	}

    oesece(); 

}
function animate() {

    requestAnimationFrame( animate );

    megamesh.rotation.x += -0.0000125 * (dataArray[1] - (dataArray[1]/2) );
    megamesh.rotation.y += -0.0000125 * dataArray[0]; 
    megamesh.rotation.z += -0.0000125 * dataArray[0]; 

    /*
    var pads = navigator.getGamepads();
    if(pads[1]){
	camera.position.x += ( (pads[1].axes[0]*50) - camera.position.x ) * .25 * Math.cos( 0.25 );
	camera.position.y += ( - (pads[1].axes[1]*50) - camera.position.y ) * .25;
	camera.position.z +=  ( (pads[1].axes[3]*20) - camera.position.z ) * .25 * Math.cos( 0.25 );
	}
    */
    
    var time2 = Date.now() * 0.005;
    var time = Date.now() * 0.001; 
    let perlin = new ImprovedNoise();

    for( var i = 0; i < total; i++){
	
	let d = perlin.noise(pX[i]*2+time,
			     pY[i]*2+time,
			     pZ[i]*2+time ) *1


	// Antes cada data arrray correspondía a una muestra
	
	cubos[i].position.x = (pX[i]) * (2+dataArray[i%64]*1.5) + (1+d) * -1;
	cubos[i].position.y = (pY[i]) * (2+dataArray[i%64]*1) + (1+d) * -1;
	cubos[i].position.z = (pZ[i]) * (2+dataArray[i%64]*1.5) + (1+d) * -1;

	cubos[i].scale.x = 0.25* (d*1)*1;	
	cubos[i].scale.y = 0.25* (d*1)*1;
	cubos[i].scale.z = 0.5* (d*1)* dataArray[i]/32;

	cubos[i].rotation.x += 1*(d*1)*0.25/16;
	cubos[i].rotation.y -= 1* (d*1)*0.25/16;

	cubos[i].rotation.z -= (d*1) * dataArray[i] / 1024;	
	bamboo[i].scale.y = (1*d) * dataArray[i%64]/1024; 
	 
    }		
    
    for ( var i = 0; i < cuboGrande.geometry.attributes.position.count; i++){

	let d = perlin.noise( cuboGrande.geometry.attributes.position.getX(i)*0.001+time,
			      cuboGrande.geometry.attributes.position.getY(i)*0.001+time,
			      cuboGrande.geometry.attributes.position.getZ(i)*0.001+time ) * 1

	cuboGrande.geometry.attributes.position.setX(
	    i, (cuboGrandeCopy.geometry.attributes.position.getX(i)) * (0.15+dataArray[i%1024]/ 125)); 

	cuboGrande.geometry.attributes.position.setY(
	    i, (cuboGrandeCopy.geometry.attributes.position.getY(i)) * (0.15+dataArray[i%1024]/ 125)
	);

	cuboGrande.geometry.attributes.position.setZ(
	    i, (cuboGrandeCopy.geometry.attributes.position.getZ(i)) * (0.15+dataArray[i%1024]/ 125)
	);
	
	}
   	
    cuboGrande.geometry.attributes.position.needsUpdate = true;
    megamesh.geometry.attributes.position.needsUpdate = true;

    // para cuando no hay pads 
    // camera.position.x = Math.sin( time2 * 0.125/4 ) * ( 75 + Math.sin( time2 * 0.125 )* 4) * 1; 
    // camera.position.y = Math.cos( time2 * 0.125/4 ) * 200; 
    // camera.position.z = Math.cos( time2 * 0.125/4 ) * - 200;
   
    camera.lookAt(0, 0, 0);
   
    vit.needsUpdate = true; 

    for(let i = 0; i < total; i++){
	cubos[i].rotation.y += 0.005; 
    }
    
    cuboGrande.rotation.x += 0.0001;
    cuboGrande.rotation.y += 0.0002;

    // camera.rotation.x +- 0.01; 
   
    renderer2.render( scene, camera );
    composer.render();

    if (retroBool ){
	vector.x = ( window.innerWidth * dpr / 2 ) - ( textureSize / 2 );
	vector.y = ( window.innerHeight * dpr / 2 ) - ( textureSize / 2 );	
	renderer2.copyFramebufferToTexture( vector, texture );
    }

    analyser.getByteFrequencyData(dataArray);
    // console.log(dataArray); 
    //analyser2.getByteFrequencyData(dataArray2);
    // analyser3.getByteFrequencyData(dataArray3); 
    // console.log(dataArray[0]/128); 

};

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer2.setSize( window.innerWidth, window.innerHeight );
    
}

function retro() {
    // const data = new Uint8Array( textureSize * textureSize * 3 );
    texture = new THREE.FramebufferTexture( textureSize, textureSize, THREE.RGBAFormat );
    //texture.minFilter = THREE.NearestFilter;
    // texture.magFilter = THREE.NearestFilter;
    //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    //texture.offset.set( 0, 0 );
    // texture.repeat.set( 2, 3 );
}

function retrorm(){
    scene.remove( cuboGrande ); 
}

function retroadd(){
    scene.add( cuboGrande ); 
}

function audio(){
    
    source = audioCtx.createBufferSource();
    request = new XMLHttpRequest();
    request.open('GET', 'audio/cello.wav', true);
    request.responseType = 'arraybuffer';

    // Comenté esto para desactivar la grabación, ahora voy a usar el audioIn
    /*
    gainNode1 = audioCtx.createGain();

    request.onload = function() {
	let audioData = request.response;
	
	audioCtx.decodeAudioData(audioData, function(buffer) {
            myBuffer = buffer;
            songLength = buffer.duration;
            source.buffer = myBuffer;
            // source.playbackRate.value = playbackControl.value;
	    //source.connect(gainNode1); 

	    // para que suene

	    //source.connect(audioCtx.destination);
            // source.loop = true;
	},
				 
				 function(e){"Error with decoding audio data" + e.error});
	
    }
    
    request.send();

    */

    source2 = audioCtx.createBufferSource();
    request2 = new XMLHttpRequest();
    request2.open('GET', 'audio/wpa1.wav', true);
    request2.responseType = 'arraybuffer';
    gainNode2 = audioCtx.createGain();

    // Comenté esto para activar el audio in 

    /*
    request2.onload = function() {
	let audioData2 = request2.response;
	
	audioCtx.decodeAudioData(audioData2, function(buffer2) {
            myBuffer2 = buffer2;
            songLength2 = buffer2.duration;
            source2.buffer = myBuffer2;
            // source.playbackRate.value = playbackControl.value;
	    // gainNode2.connect(source2); 
            //source2.connect(audioCtx.destination);
            // source2.loop = true;
	},
				 
				 function(e){"Error with decoding audio data" + e.error});
	
    }
    
    request2.send();

    */
    
    source3 = audioCtx.createBufferSource();
    request3 = new XMLHttpRequest();
    request3.open('GET', 'audio/wpa2.wav', true);
    request3.responseType = 'arraybuffer';
    gainNode3 = audioCtx.createGain();

    // Comenté esto por el audio in

    /*
    request3.onload = function() {
	let audioData3 = request3.response;
	
	audioCtx.decodeAudioData(audioData3, function(buffer3) {
            myBuffer = buffer3;
            songLength3 = buffer3.duration;
            source3.buffer = myBuffer;
            // source.playbackRate.value = playbackControl.value;
	    // source3.connect(gainNode3); 
            //source3.connect(audioCtx.destination);
            // source3.loop = true;
	},
				 
				 function(e){"Error with decoding audio data" + e.error});
	
    }
    
    request3.send();
     */ 

    analyser = audioCtx.createAnalyser();
    microphone.connect(analyser);
    analyser.fftSize = 1024;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray)
    analyser.smoothingTimeConstant = 0.99;

    // Comenté esto por que todavía no sé cómo separar señales de audio en el navegador 
    /*
    analyser2 = audioCtx.createAnalyser();
    source2.connect(analyser2);
    analyser2.fftSize = 1024;
    bufferLength2 = analyser2.frequencyBinCount;
    dataArray2 = new Uint8Array(bufferLength2);
    analyser2.getByteTimeDomainData(dataArray2)
    analyser2.smoothingTimeConstant = 0.95;

    
    analyser3 = audioCtx.createAnalyser();
    source3.connect(analyser3);
    analyser3.fftSize = 1024;
    bufferLength3 = analyser3.frequencyBinCount;
    dataArray3 = new Uint8Array(bufferLength3);
    analyser3.getByteTimeDomainData(dataArray3)
    analyser3.smoothingTimeConstant = 0.95; 

    */ 
}


function score(){

    let metaContador = 0; 
    let contador = 0;
    let sw = true;
    let conti = true; 

    /*
    rocas = new Tone.Loop((time) => {

	if(sw == true){
	    scene.add(cubos[contador]);
	    scene.add(bamboo[contador]); 
	    contador++;
	} else {
	    scene.remove(cubos[contador]);
	    scene.remove(bamboo[contador]); 
	    contador--;
	}

	if(contador == total){
	    sw = false; 
	}

	if(contador == -1){
	    // rocas.stop(); // aquí podría activarse el siguiente momento
	    console.log("final");
	    sw = true;
	    metaContador++;
	    // if(metaContador == 2) {
	    rocas.stop();
	}
	
    }, "0.2");

    Tone.Transport.start();
    */
    
}

function rtSph(){
    material.map = vit; 
    materialC2.map = texture;
}

function rtCub(){
    material.map = texture;
    materialC2.map = vit; 
}


function swHydra( numero ){

    switch( numero ) {
    case 0:
	osc(() => osci, 0.1, () => colorHydra ) // osci
	    .color(1.3, 0.9,1.2) 
            .kaleid(()=> kal) // kal
	    .diff(voronoi(()=>voro, ()=>vorvel, 0) // voro, vorovel
		  .color(0, 0, 0))
            .rotate(ang, rotvel) // ang, rotvel 
            .modulateScrollX(o0, () => (mod * 0.0003)) // mod (antes estaba solo modulate)  
            .scale(scl, sclX, sclY) // scl, sclX, sclY
	    .saturate(sat) // sat
            .out(o0)
	break;
    case 1:
	osc(osci, 0.1, () => colorHydra ) // osci
	    .color(1.3, 0.9,1.2) 
            .kaleid(kal) // kal
	    .diff(voronoi(voro, vorvel, 0) // voro, vorovel
		  .color(0, 0, 0))
            .rotate(ang, rotvel) // ang, rotvel 
            .modulate(o0, () => (mod * 0.0003)) // mod (antes estaba solo modulate)  
            .scale(scl, sclX, sclY) // scl, sclX, sclY
	    .saturate(sat) // sat
            .out(o0)
	
	break;
    case 2:
	osc(osci, 0.1, () => colorHydra ) // osci
	    .color(1.3, 0.9,1.2) 
            .kaleid(kal) // kal
	    .diff(voronoi(voro, vorvel, 0) // voro, vorovel
		  .color(0, 0, 0))
            .rotate(ang, rotvel) // ang, rotvel 
            .modulate(o0, () => (mod * 0.0003)) // mod (antes estaba solo modulate)  
            .scale(scl, sclX, sclY) // scl, sclX, sclY
	    .saturate(sat) // sat
            .out(o0)
	break;
    case 3:
	osc(20, 0.01, () => colorHydra)
	    .color(1.3, 0.9, 1.2) 
	    .kaleid(20)
	    .rotate(1, 0.1)
	    .modulate(o0, () => mod * 0.0003)
	    .scale(0.99)
	    .saturate(sat) 
  	    .out(o0)
	break;
    case 4:
	    voronoi(8,1)
	    .mult(osc(10,0.1,colorHydra)
		  .color(1.3, 0.9, 1.2))
	    .modulate(o0,0.5)
	    .add(o0,0.8)
	    .scrollY(-0.01)
	    .scale(0.99)
	    .modulate(voronoi(8,1),0.008)
	    .luma(()=>mod*0.0009)
	    .saturate(sat)
	    .out()
	break; 
	
    case 5:
	voronoi(8,1)
	    .mult(osc(10,0.1,0.2))
	    .modulate(o0,0.5)
	    .add(o0,0.8)
	    .scrollY(-0.01)
	    .scale(0.99)
	    .modulate(voronoi(8,1),0.008)
	    .luma(()=>mX*0.0009) 
	    .out()
	    break;
    case 6:
	osc(5, 0.9, 0.00)
	    .kaleid([3,4,5,7,8,9,10].fast(0.1))
	    .rotate(0.009,()=>Math.sin(time)* -0.0001 )
	    .modulateRotate(o0,()=>Math.sin(time) * 0.0003)
	    .modulate(o0, ()=>mX*0.0009)
	//  .scale(()=>mouse.y*0.0009) //cambiar X
	    .scale(.99) //scala estática
	    .out(o0)
	break;
    case 7:
	osc(5)
	    .modulate(noise(6),.22).diff(o0)
	    .modulateScrollY(osc(0.8).modulate(osc(10).modulate(osc(2,0.1),()=>mX*0.01).rotate(),.91))
	    .scale(.79)
	    .out()
	
	break;
	
    case 8:
	osc(105).rotate(0.11, 0.1).modulate(osc(10).rotate(0.3).add(o0, 0.1)).add(osc(20,0.01,0)).out(o0)
	osc(50,0.005).diff(o0).modulate(o1,()=>mX*0.00009).out(o1)
	render(o1)
	break;
    case 9:
	voronoi(350,0.15)
	    .modulateScale(osc(8).rotate(Math.sin(time)),.5)
	    .thresh(.8)
	    .modulateRotate(osc(7),.4)
	    .thresh(.7)
	    .diff(src(o0).scale(1.8))
	    .modulateScale(osc(2).modulateRotate(o0,.74))
	    .diff(src(o0).rotate([-.012,.01,-.002,0]).scrollY(0,[-1/199800,0].fast(0.7)))
	    .brightness([-.02,-.17].smooth().fast(.5))
	    .out()
	break;
    case 10:
	shape(20,0.11,0.3)
	    .scale(.9)
	    .repeat(() => Math.sin(time)*100)
	    .modulateRotate(o0)
	    .scale(()=>mX*0.01)
	    .modulate(noise(10,2))
	    .rotate(1, .2)
	    .layer(o0,0.1)
	    .modulateScrollY(noise(3),-0.1)
	    .scale(0.999)
	    .modulate(voronoi(1,1),0.08)
	    .out(o0)
	break;
    case 11: 
	shape(8,0.5)
	    .scale(0.3,3)
	    .rotate(-1.3)
	    .scrollY(0,-0.3)
	    .repeat(2,2, ()=>Math.sin(time)*4,()=>Math.sin(time)*4)
	    .add(src(o0)
   		 .scrollY(0.001),0.99)
	    .scale(1.01)
	    .layer(src(o0)
     		   .mask(shape(3,() => Math.sin(time)*0.5+0.8,-0.001)
           		 .rotate(0,2).scale(0.5,0.5))
     		   .shift([0,-0.001].fast(0.1),0,[-0.001,0.001])
		   .colorama([0.001,0.002,0.008,-0.009].fast(0.5))
     		   .scrollY(-0.005))
	    .blend(o0,0.4)
	    .saturate([1,0.8])
	    .out()
	break; 
    }
        
}

function createPanel(){

    const panel = new GUI({width:310});
    const folder1 = panel.addFolder( 'Reproducción' );
    var objRepro = {iniciar:repro}
    folder1.add(objRepro,'iniciar'); 
    var objAlto = {detener:stop}
    folder1.add(objAlto,'detener');
    const folder2 = panel.addFolder( 'Grabación' );
    const folder3 = panel.addFolder( 'Transformación' );
    
}

function repro(){

    if(primera == 0){
	console.log("iniciar");
	source.start(0);
	source2.start(0);
	source3.start(0);
    } else {
	console.log("reiniciar");
	gainNode1.gain.setValueAtTime(1, audioCtx.currentTime);
	gainNode2.gain.setValueAtTime(1, audioCtx.currentTime);
	gainNode3.gain.setValueAtTime(1, audioCtx.currentTime);
    }
    
    primera++;
   
}

function stop(){
    console.log("detener o más bien mutear");
    //source.stop();
    //source2.stop();
    //source3.stop();
    gainNode1.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode2.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode3.gain.setValueAtTime(0, audioCtx.currentTime);
}



var setup = function SetUp(sampleRate) {
        
    console.log("setup!");    
    onsetdetector = new MMLLOnsetDetector(sampleRate); //default threshold 0.34
    onsetdetector.threshold = 0.2; 
    
   console.log(webaudio) ; 
 
    var pruebaGrain = webaudio.audiocontext.createGain(); 

    // aquí es donde se tienen que crear los objetos con el contexto de audio
    // cerrar el otro contexto de audio 
    webaudio.audiocontext.close();
    // asignar el nuevo contexto de audio a la librería 
    webaudio.audiocontext = audioCtx;
    // webaudio.audioinput.disconnect(webaudio.audiocontext.destination);    
    // audioinput.connect(self.node);
    // webaudio.audioinput.disconnect(webaudio.node); // esto podría funcionar para desactivar el el mic  

    // vale la pena poner un loop? Sí vale la pena, realmente no es un loop 

    loop = new Tone.Loop((time) => {
	// console.log(time);
	// aquí tendría que haber algo aunque a lo mejor se está realizando de otra forma 
    }, params.recordingSize).start(0);
    Tone.Transport.start();
    
    
};


var callback = function CallBack(input,output,n) {
   
    var detection = onsetdetector.next( input.monoinput );
    if(detection && !mute ) { // jugar con el mute
        // console.log('onset!!!');

	// descomentados en lo que se incorporan 
	
	//random();
	// random2(); 

    }
    
};

/// simplificar


function samples(){

    // Primera fuente 

    source = audioCtx.createBufferSource();
    request = new XMLHttpRequest();
    request.open('GET', 'audio/cello.wav', true);
    request.responseType = 'arraybuffer';

    /*
    var gainPrueba = webaudio.audiocontext;
    console.log(gainPrueba); 
    */
    
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);  

    // comenté todo esto
    
    /*
    request.onload = function() {
	let audioData = request.response;
	
	audioCtx.decodeAudioData(audioData, function(buffer) {
	    Array.prototype.reverse.call( buffer.getChannelData(0) );
            Array.prototype.reverse.call( buffer.getChannelData(1) );
            source.buffer = buffer;
            // myBuffer = buffer;
            flduration = buffer.duration;
            //source.buffer = myBuffer;
            // source.playbackRate.value = 1;
	    source.loop = true; 
	    source.loopStart = 8.1;
	    source.loopEnd = 8.2;
	    // source.detune.value = 500; 
	    // gainNode1.value = 1; 
	    //source.connect(gainNode); 
            gainNode.connect(audioCtx.destination);

	    // si es el mismo sonido procedasado lo que detona los cambios en el sonido procesado, entonces puede que en algún momento se quede estático
	    
	    // gainNode.connect(webaudio.node); // 
            //source.loop = true;
	},
				 
				 function(e){"Error with decoding audio data" + e.error});
				 
    }
    
    request.send();
    source.start();

    // Segunda fuente 
    
    source2 = audioCtx.createBufferSource();
    request2 = new XMLHttpRequest();
    request2.open('GET', 'audio/cello.wav', true);
    request2.responseType = 'arraybuffer';
   
    gainNode2 = audioCtx.createGain();
    gainNode2.gain.setValueAtTime(0.5, audioCtx.currentTime);  
    
    request2.onload = function() {
	let audioData2 = request2.response;
	
	audioCtx.decodeAudioData(audioData2, function(buffer) {
            //myBuffer = buffer;
            flduration2 = buffer.duration;
            source2.buffer = buffer;
            source2.playbackRate.value = 1;
	    source2.loop = true; 
	    source2.loopStart = 18.1;
	    source2.loopEnd = 18.2;
	    // source.detune.value = 500; 
	    // gainNode1.value = 1; 
	    //source2.connect(gainNode2); 
            gainNode2.connect(audioCtx.destination);

	    
	    // Parece ser que no se pueden conectar porque son de distintos contextos de audio, entonces hay que unificarlos 

	    // gainNode2.connect(webaudio.node); // solamente la señal principal 

            //source.loop = true;
	},
				 
				 function(e){"Error with decoding audio data" + e.error});
    }
    
    request2.send(); 
    source2.start(); 

    // Tercera fuente 
    
    source3 = audioCtx.createBufferSource();
    request3 = new XMLHttpRequest();
    request3.open('GET', 'audio/cello.wav', true);
    request3.responseType = 'arraybuffer';
   
    gainNode3 = audioCtx.createGain();
    gainNode3.gain.setValueAtTime(0.5, audioCtx.currentTime);  
    
    request3.onload = function() {
	let audioData3 = request3.response;
	
	audioCtx.decodeAudioData(audioData3, function(buffer) { // esto igual y no es realmente necesario  
            //myBuffer = buffer;
            flduration3 = buffer.duration;
            source3.buffer = buffer;
            //source3.playbackRate.value = 1;
	    source3.loop = true; 
	    //source3.loopStart = 18.1;
	    // source3.loopEnd = 18.2;
	    // source.detune.value = 500; 
	    // gainNode1.value = 1; 
	    // source3.connect(gainNode3); 
            gainNode3.connect(audioCtx.destination);

	    
	    // Parece ser que no se pueden conectar porque son de distintos contextos de audio, entonces hay que unificarlos 

	    gainNode3.connect(webaudio.node); // solamente la señal principal 

            //source.loop = true;
	},
				 
				 function(e){"Error with decoding audio data" + e.error});
    }
    
    request3.send(); 
    source3.start();
    source3.connect(dest);

    */
    
    analyser = audioCtx.createAnalyser();
    microphone.connect(analyser);
    //source2.connect(analyser);
    //source3.connect(analyser); 
    analyser.fftSize = 512;
    bufferLengthAnalyser = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLengthAnalyser);
    analyser.getByteTimeDomainData(dataArray)
    analyser.smoothingTimeConstant = 0.85;


    /*
    analyser2 = audioCtx.createAnalyser();
    source2.connect(analyser2);
    analyser2.fftSize = 1024;
    bufferLength2 = analyser2.frequencyBinCount;
    dataArray2 = new Uint8Array(bufferLength2);
    analyser2.getByteTimeDomainData(dataArray2)
    analyser2.smoothingTimeConstant = 0.95;

    
    analyser3 = audioCtx.createAnalyser();
    source3.connect(analyser3);
    analyser3.fftSize = 1024;
    bufferLength3 = analyser3.frequencyBinCount;
    dataArray3 = new Uint8Array(bufferLength3);
    analyser3.getByteTimeDomainData(dataArray3)
    analyser3.smoothingTimeConstant = 0.95; 

   */
}

function random(){

    // centroide espectral para afinación 
    // source.start(); 
    source.playbackRate.setValueAtTime(Math.random() * 4, 0); 
    // source.playbackRate.value = 0.125 + (Math.random() *1.5);
    sz = 0.1;
    strt = Math.random() * flduration; 
    source.loopStart = strt;
    source.loopEnd = strt + sz;
    // source.detune.value = Math.random() * 100 -50; 
    // source.loopEnd = 9.2 + (Math.random() * 8);
    // console.log(flduration*Math.random()); 
}

function random2(){

    source2.playbackRate.setValueAtTime(Math.random() * 4, 0); 
    // source2.playbackRate.value = 0.125 + (Math.random() *1.5);
    sz2 = 0.1;
    strt2 = Math.random() * flduration2; 
    source2.loopStart = strt2;
    source2.loopEnd = strt2 + sz2; 
    // source.loopEnd = 9.2 + (Math.random() * 8);
}

function oesece(){
    
    osc2.on('/switchHydra', message => {

	// hydra.hush();

	velocidadCubos = message.args[0];
	
	switch(  message.args[0] ) {
	case 0:
	    osc(() => osci, 0.1, () => colorHydra ) // osci
		.color(1.3, 0.9,1.2) 
                .kaleid(()=> kal) // kal
		.diff(voronoi(()=>voro, ()=>vorvel, 0) // voro, vorovel
		      .color(0, 0, 0))
                .rotate(ang, rotvel) // ang, rotvel 
                .modulateScrollX(o0, () => (mod * 0.0003)) // mod (antes estaba solo modulate)  
                .scale(scl, sclX, sclY) // scl, sclX, sclY
		.saturate(sat) // sat
                .out(o0)
	    break;
	case 1:
	    osc(osci, 0.1, () => colorHydra ) // osci
		.color(1.3, 0.9,1.2) 
                .kaleid(kal) // kal
		.diff(voronoi(voro, vorvel, 0) // voro, vorovel
		      .color(0, 0, 0))
                .rotate(ang, rotvel) // ang, rotvel 
                .modulate(o0, () => (mod * 0.0003)) // mod (antes estaba solo modulate)  
                .scale(scl, sclX, sclY) // scl, sclX, sclY
		.saturate(sat) // sat
                .out(o0)

	    break;
	case 2:
	    osc(osci, 0.1, () => colorHydra ) // osci
		.color(1.3, 0.9,1.2) 
                .kaleid(kal) // kal
		.diff(voronoi(voro, vorvel, 0) // voro, vorovel
		      .color(0, 0, 0))
                .rotate(ang, rotvel) // ang, rotvel 
                .modulate(o0, () => (mod * 0.0003)) // mod (antes estaba solo modulate)  
                .scale(scl, sclX, sclY) // scl, sclX, sclY
		.saturate(sat) // sat
                .out(o0)
	    break;
	case 3:
	    osc(20, 0.01, () => colorHydra)
		.color(1.3, 0.9, 1.2) 
		.kaleid(20)
		.rotate(1, 0.1)
		.modulate(o0, () => mod * 0.0003)
		.scale(0.99)
		.saturate(sat) 
  		.out(o0)
	    break;
	case 4:
	    voronoi(8,1)
		.mult(osc(10,0.1,colorHydra)
		.color(1.3, 0.9, 1.2))
		.modulate(o0,0.5)
		.add(o0,0.8)
		.scrollY(-0.01)
		.scale(0.99)
		.modulate(voronoi(8,1),0.008)
		.luma(()=>mod*0.0009)
		.saturate(sat)
		.out()
	    break; 

	case 5:
	    voronoi(8,1)
		.mult(osc(10,0.1,0.2))
		.modulate(o0,0.5)
		.add(o0,0.8)
		.scrollY(-0.01)
		.scale(0.99)
		.modulate(voronoi(8,1),0.008)
		.luma(()=>mX*0.0009) 
		.out()
	    break;
	case 6:
	    	    osc(5, 0.9, 0.00)
		.kaleid([3,4,5,7,8,9,10].fast(0.1))
		.rotate(0.009,()=>Math.sin(time)* -0.0001 )
		.modulateRotate(o0,()=>Math.sin(time) * 0.0003)
		.modulate(o0, ()=>mX*0.0009)
	    //  .scale(()=>mouse.y*0.0009) //cambiar X
		.scale(.99) //scala estática
		.out(o0)
	    break;
	case 7:
	    	    osc(5)
		.modulate(noise(6),.22).diff(o0)
		.modulateScrollY(osc(0.8).modulate(osc(10).modulate(osc(2,0.1),()=>mX*0.01).rotate(),.91))
		.scale(.79)
		.out()

	    break;

	case 8:
	    osc(105).rotate(0.11, 0.1).modulate(osc(10).rotate(0.3).add(o0, 0.1)).add(osc(20,0.01,0)).out(o0)
	    osc(50,0.005).diff(o0).modulate(o1,()=>mX*0.00009).out(o1)
	    render(o1)
	    break;
	case 9:
	    voronoi(350,0.15)
		.modulateScale(osc(8).rotate(Math.sin(time)),.5)
		.thresh(.8)
		.modulateRotate(osc(7),.4)
		.thresh(.7)
		.diff(src(o0).scale(1.8))
		.modulateScale(osc(2).modulateRotate(o0,.74))
		.diff(src(o0).rotate([-.012,.01,-.002,0]).scrollY(0,[-1/199800,0].fast(0.7)))
		.brightness([-.02,-.17].smooth().fast(.5))
		.out()
	    break;
	case 10:
	    shape(20,0.11,0.3)
		.scale(.9)
		.repeat(() => Math.sin(time)*100)
		.modulateRotate(o0)
		.scale(()=>mX*0.01)
		.modulate(noise(10,2))
		.rotate(1, .2)
		.layer(o0,0.1)
		.modulateScrollY(noise(3),-0.1)
		.scale(0.999)
		.modulate(voronoi(1,1),0.08)
		.out(o0)
	    break;
	case 11: 
	    shape(8,0.5)
		.scale(0.3,3)
		.rotate(-1.3)
		.scrollY(0,-0.3)
		.repeat(2,2, ()=>Math.sin(time)*4,()=>Math.sin(time)*4)
		.add(src(o0)
   		     .scrollY(0.001),0.99)
		.scale(1.01)
		.layer(src(o0)
     		       .mask(shape(3,() => Math.sin(time)*0.5+0.8,-0.001)
           		     .rotate(0,2).scale(0.5,0.5))
     		       .shift([0,-0.001].fast(0.1),0,[-0.001,0.001])
		       .colorama([0.001,0.002,0.008,-0.009].fast(0.5))
     		       .scrollY(-0.005))
		.blend(o0,0.4)
		.saturate([1,0.8])
		.out()
	    break; 
	}
	
	console.log(message.args[0]); 
    })

    osc2.on('/cubos', message => {
	if(message.args[0]){
	    for( var i = 0; i < total; i++){
		scene.add(cubos[i]);
	    }
	} else {
	    for( var i = 0; i < total; i++){
		scene.remove(cubos[i]);
	    }
	}  
    });

    osc2.on('/bloom', message => {
	bloomPass.strength = message.args[0];
    });

    
    osc2.on('/sph', message => {
	if(message.args[0]){
	    scene.add(sph); 
	} else {
	    scene.remove(sph); 
	}
    });

    osc2.on('/retroB', message => {
	retroBool = message.args[0];
	// console.log( retroBool );
	if(retroBool){
	    retroadd();
	} else {
	    retrorm(); 
	}
    });

    osc2.on('/iniciar', message => {
	// bloomPass.strength = message.args[0];
	// scene.remove(plane); 
	if(message.args[0]){
	    rocas.start();
	}
    });

    /*
    osc2.on('/meshFinal', message => {
	boolMesh = message.args[0];
	// console.log( retroBool );
	if(boolMesh){
	    addMesh();
	} else {
	    rmMesh(); 
	}
    });
    */
    
    osc2.on('/camX', message => {
	camera.position.x = message.args[0];
    })

    osc2.on('/camY', message => {
	camera.position.y = message.args[0];
    })

    osc2.on('/camZ', message => {
	camera.position.z = message.args[0];
    })

    osc2.on('/mX', message => {
	mX = message.args[0];
    })

     osc2.on('/mY', message => {
	mY = message.args[0];
    })

    osc2.on('/osci', message => {
	osci = message.args[0];
    })

    osc2.on('/kal', message => {
	kal = message.args[0];
    })

    osc2.on('/voro', message => {
	voro = message.args[0];
    })

    osc2.on('/vorvel', message => {
	vorvel = message.args[0];
    })

     osc2.on('/ang', message => {
	ang = message.args[0];
    })

    osc2.on('/rotvel', message => {
	rotvel = message.args[0];
    })

    osc2.on('/mod', message => {
	mod = message.args[0];
    })

     osc2.on('/scl', message => {
	scl = message.args[0];
     })

    osc2.on('/sclX', message => {
	sclX = message.args[0];
    })

    osc2.on('/sclY', message => {
	sclY = message.args[0];
    })

    osc2.on('/sat', message => {
	sat = message.args[0];
    })

    osc2.on('/bamboo', message => {
	if(message.args[0]){
	    loc = 0; 
	    for(let k=0; k<18;k++){
		for(let i=1;i<6;i++){
		    scene.add(bamboo[loc]);
		    loc++; 
		}
	    }
	} else {
	    loc = 0; 
	    for(let k=0; k<16;k++){
		for(let i=1;i<16;i++){
		    scene.remove(bamboo[loc]);
		    loc++; 
		}
	    }

	}
    })

    osc2.on('/rtSph', message => {
	rtSph(); 
    })
    
    osc2.on('/rtCub', message => {
	rtCub(); 
    })

    osc2.on('/colorHydra', message => {
	colorHydra = message.args[0]; 
    })

}
