
// se ve muy raro hydra como textura

import * as Tone from 'tone';
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

const osc2 = new OSC();
osc2.open();

document.body.style.cursor = 'none'; 

let renderer2, scene, camera, composer, controls, container; 
let cube, ring, ring2, ring3;
let switchHydra = 0, switchModel = 0; 

let object; 

let texture;
let dpr = window.devicePixelRatio; 
let textureSize = 1024 * dpr;
const vector = new THREE.Vector2();

let materialC2;
let audioSphere; 
let cuboGrande, cuboGrandeCopy; 
let sph; 

let retroBool = true;
let gamepads; 

let retroEsfera = false;
let retroCubos = true; 

let light1, light2, light3, light4; 

let bamboo = []; 

let cubos = [];

let pX = [], pY = [], pZ = []; 

// let mX = 1000, mY = 10; 

let osci=10, kal=5, voro=5, vorvel=0.5, ang=10, rotvel=0.1, mod=1000, scl = 0.49, sclX = 1.05, sclY = 0.95, sat = 1, colorHydra = 0.1;  

let total = 256;

var hydra = new Hydra({
    canvas: document.getElementById("myCanvas"),
    detectAudio: false,
    //makeGlobal: false
}) // antes tenía .synth aqui 

solid().color(0, 0, 0).out(o0);

    
const elCanvas = document.getElementById( 'myCanvas');
elCanvas.style.display = 'none';     
let vit = new THREE.CanvasTexture(elCanvas);

Tone.start().then(init()); 

let an, mic; 
let anSphere = false, anObject = false; 
let vertices = []; 
let boolMesh = true; 
let meshFinal; 
let rocas;
let velocidadCubos = 1; 
let velocidadEnt = 1; 
let material; 

function init(){

    container = document.getElementById( 'container' );
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 0.1, 2000 );

    // scene.fog = new THREE.Fog(0x000000, 10, 960);

    retro();

    audio(); 
    scene.background = new THREE.Color( 0x000000 ); 
    
    //const geometry = new THREE.BoxGeometry(3, 3, 3);
    const geometry = new THREE.SphereGeometry(96, 2, 3 );
    // Buffergeometry 
    // console.log(geometry.attributes.position); 
    material = new THREE.MeshBasicMaterial( { color: 0xffffff, map:texture } );

    for(let i = 0; i < total; i++){
  
	cubos[i] = new THREE.Mesh( geometry, material );

	var posX, posY, posZ;
	
	var theta1 = Math.random() * (Math.PI*2);
	var theta2 = Math.random() * (Math.PI*2); 

	posX = Math.cos(theta1) * Math.cos(theta2);
	posY = Math.sin(theta1);
	posZ = Math.cos(theta1) * Math.sin(theta2);

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

    // const geometryP = new THREE.PlaneGeometry( 16*2, 9*2 );
    // const materialP = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, map: vit2 } );
    // const plane = new THREE.Mesh( geometryP, materialP );
    // scene.add( plane );

    materialC2 = new THREE.MeshBasicMaterial( {
	map: vit,
	side: THREE.DoubleSide,
	//roughness: 0.8,
	// metalness: 0.2
	// transparent: true,
	// color: diffuseColor,
	// reflectivity: beta,
	// envMap: alpha < 0.5 ? reflectionCube : null
    } );

    
	
    const sphGeom = new THREE.SphereGeometry( 20, 64, 64 );
    sph = new THREE.Mesh(sphGeom, materialC2); 
    
    audioSphere = new THREE.SphereGeometry( 1000, 64, 64 );
    // audioSphere = new THREE.CylinderGeometry( 500, 500, 500, 6 );
    // audioSphere = new THREE.BoxGeometry( 1500, 1500, 1500, 32, 32, 32 )
    audioSphere.usage = THREE.DynamicDrawUsage;
	
    audioSphere.computeBoundingBox();	  
  
    cuboGrande = new THREE.Mesh(audioSphere, materialC2 );
    cuboGrandeCopy = new THREE.Mesh(audioSphere.clone(), materialC2 );

    // materialC2.depthTest = false; 
    cuboGrande.geometry.usage = THREE.DynamicDrawUsage;
	    
   scene.add(cuboGrande);
   
    let pilaresMaterial = new THREE.MeshBasicMaterial( {
	color: 0x000000,
	// envMap: vit,
	// refractionRatio: 0.75,
	// roughness: 0.4,
	// metalness: 0.8,
	//map: texture
    } );
    
    const pilargeom = new THREE.BoxGeometry(2, 2000, 2 );

    let loc = 0;
     for(let k=0; k<16;k++){
	for(let i=1;i<16;i++){

	    bamboo[loc] = new THREE.Mesh(pilargeom, pilaresMaterial )
	    // bamboo[loc].rotation.set((Math.random()- 1 )/2, 0, (Math.random()-1)/2)
	    bamboo[loc].rotation.set((Math.random()- 0.5 )/2, 0, (Math.random()-0.5)/2)

	    let ang = (k * 10 + ((i+1)%3)* 3 + i) * 2 * Math.PI/100
	    let r1 = 22 + 156*i
	    let r2 = 21 + 152*i
	    
	    bamboo[loc].position.set(r1 * Math.sin(ang), 10, r2 *Math.cos(ang) )
	    bamboo[loc].scale.y = Math.random() * 1000+ 10; 
	    // scene.add(bamboo[loc])
	    loc++; 
	}
    }
    
    camera.position.z = 10;

    /*
    const loader = new OBJLoader();

    loader.load(
	'3d/objeto.obj',
	function ( object ) {
	    console.log(object.children[0]); 
	    obj = object.children[0];
	    obj.material = materialC2;
	    // obj.geometry = THREE.BufferGeometryUtils.mergeVertices(obj.geometry);
	    obj.geometry.computeVertexNormals(true); 
	    scene.add( obj );
	}
	);
    */

    /*
    let vertices = [];
    let normales = []; 
    const cantidad = 1000;
    
    for(let i = 0; i < cantidad; i++){
	for(let j = 0; j < cantidad; j++){

	    let lat = THREE.MathUtils.mapLinear(i, 0, cantidad,  -Math.PI, Math.PI);
	    let lon = THREE.MathUtils.mapLinear(j, 0, cantidad, -Math.PI, Math.PI);
	    
	    //let x = 1.5 * Math.cos(lat) * (1.5 + Math.sin(lon) * Math.cos(lat) - Math.sin(2*lon) * Math.sin(lat) / 2);
            //let y = 1.5 * Math.sin(lat) * (1.5 + Math.sin(lon) * Math.cos(lat) - Math.sin(2*lon) * Math.sin(lat) / 2) ;
            //let z = 1.5 * Math.sin(lat) * Math.sin(lon) + Math.cos(lat) * Math.sin(2*lon) / 2 ;
	    

	    let x =  2 * Math.cos(lat) * Math.cos(lon);
	    let y =  2 * Math.sin(lat) * Math.cos(lon);
	    let z =  2 * Math.sin(lon) + 1*lat;  
	    
	    vertices.push(x, y, z);
	   
	}
    }

    const geometry2 = new THREE.PlaneGeometry( 5, 5, cantidad, cantidad);

    meshFinal = new THREE.Mesh(geometry2, material );
    meshFinal.scale.x = 16; 
    meshFinal.scale.y = 16; 
    meshFinal.scale.z = 16; 
     
    geometry2.attributes.position.needsUpdate = true;
    // geometry2.computeVertexNormals(); 

    for(let i = 0; i < geometry2.attributes.position.count; i++){
	geometry2.attributes.position.setX(i, vertices[i*3]);
	geometry2.attributes.position.setY(i, vertices[i*3+1]); 
	geometry2.attributes.position.setZ(i, vertices[i*3+2]); 
    }

*/

    // console.log(vertices); 
    // scene.add(meshFinal); 
    
    renderer2 = new THREE.WebGLRenderer();
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
    bloomPass.threshold = 0.8;
    bloomPass.strength = 0.1; // parametrizable 
    bloomPass.radius = 0.8;

    let fxaaPass = new ShaderPass( FXAAShader );
    const pixelRatio = container.getPixelRatio;

    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
    fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );
    
    //composer = new EffectComposer( renderer2 );
    //composer.addPass( renderScene );
    //composer.addPass( bloomPass );
    //composer.addPass( fxaaPass );

    controls = new OrbitControls( camera, renderer2.domElement );
    controls.maxDistance = 300;

    osc2.on('/switchHydra', message => {

	// hydra.hush();
	
	switch(  message.args[0] ) {
	case 0:
	    osc(() => osci, 0.1, 0 ) // osci
		//.color(1.3, 0.9,1.2) 
                .kaleid(()=> kal) // kal
		.diff(voronoi(voro, vorvel, 0) // voro, vorovel
		      .color(0, 0, 0))
                .rotate(ang, rotvel) // ang, rotvel 
                .modulateScrollX(o0, () => (mod * 0.0003)) // mod (antes estaba solo modulate)  
                .scale(scl, sclX, sclY) // scl, sclX, sclY
		.saturate(sat) // sat
                .out(o0)
	    break;
	case 1:
	    osc(osci, 0.1, 0 ) // osci
		//.color(1.3, 0.9,1.2) 
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
	    osc(osci, 0.1, 0 ) // osci
		//.color(1.3, 0.9,1.2) 
                .kaleid(kal) // kal
		.diff(voronoi(voro, vorvel, 0) // voro, vorovel
		      .color(0, 0, 0))
                .rotate(ang, rotvel) // ang, rotvel 
                .modulate(o0, () => (mod * 0.0003)) // mod (antes estaba solo modulate)  
                .scale(scl, sclX, sclY) // scl, sclX, sclY
		.saturate(sat) // sat
                .out(o0)

	    break;
	case 4:
	    solid().out();
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

    osc2.on('/velocidadCubos', message => {
	velocidadCubos = message.args[0]; 
    })
    
    score();
    animate();
    
}
function animate() {

    requestAnimationFrame( animate );

    var time2 = Date.now() * 0.005;
    var time = Date.now() * 0.0005; // por aquí podría estar un parámetro de velocidad 
    let perlin = new ImprovedNoise();

    for( var i = 0; i < total; i++){
	
	let d = perlin.noise(pX[i]*1+time,
			     pY[i]*1+time,
			     pZ[i]*1+time ) *0.2

	cubos[i].position.x = (pX[i]*20)* (1+d) * ((Tone.dbToGain( an.getValue()[i%32])*50000) );
	cubos[i].position.y = (pY[i]*20)* (1+d) * ((Tone.dbToGain( an.getValue()[i%32])*50000) );
	cubos[i].position.z = (pZ[i]*20)* (1+d) * ((Tone.dbToGain( an.getValue()[i%32])*50000) );

	
	cubos[i].scale.x = 3* (d*1)*1;
	cubos[i].scale.y = 3* (d*1)*1;
	cubos[i].scale.z = 3* (d*1)*1;

	cubos[i].rotation.x += 1*(d*1)*0.25;
	cubos[i].rotation.y -= 1* (d*1)*0.25;
	cubos[i].rotation.z += 1* (d*1)*0.25;
	
	// bamboo[i].scale.y = (1+d) * ((Tone.dbToGain( an.getValue()[i%32])*50000))
	 
    }		
				    

   
    for ( var i = 0; i < cuboGrande.geometry.attributes.position.count; i++){

	let d = perlin.noise( cuboGrande.geometry.attributes.position.getX(i)*0.0001+time,
			      cuboGrande.geometry.attributes.position.getY(i)*0.0001+time,
			      cuboGrande.geometry.attributes.position.getZ(i)*0.0001+time ) * 1

	cuboGrande.geometry.attributes.position.setX(
	    i, (cuboGrandeCopy.geometry.attributes.position.getX(i)) * (1+d)
	);

	cuboGrande.geometry.attributes.position.setY(
	    i, cuboGrandeCopy.geometry.attributes.position.getY(i) * (1+d)
	);

	cuboGrande.geometry.attributes.position.setZ(
	    i, cuboGrandeCopy.geometry.attributes.position.getZ(i) * (1+d)
	);
	
	
	}
	

    // cuboGrande.geometry.attributes.position.needsUpdate = true;

    
    camera.position.x = Math.sin( time2 * 0.125/4 ) * ( 75 + Math.sin( time2 * 0.125 )* 4) * 1; 
    camera.position.y = Math.cos( time2 * 0.125/4 ) * 200; 
    camera.position.z = Math.cos( time2 * 0.125/4 ) * - 200;
    
    camera.lookAt(0, 0, 0);
   
    /*
    light1.position.x = Math.sin( time2 * 0.3/2 ) * 14;
    light1.position.y = Math.cos( time2 * 0.7/2 ) * 10;
    light1.position.z = Math.cos( time2 * 0.3/2 ) * 14 ;

    light2.position.x = Math.cos( time2 * 0.7/2 ) * -14;
    light2.position.y = Math.sin( time2* 0.3/2 ) * -10;
    light2.position.z = Math.cos( time2 * 0.3/2 ) * -14;

    */
    
    vit.needsUpdate = true; 
    // vit2.needsUpdate = true; 

    for(let i = 0; i < total; i++){
	cubos[i].rotation.y += 0.005; 
    }

    
    cuboGrande.rotation.x += 0.0001;
    cuboGrande.rotation.y += 0.0002;

    // camera.rotation.x +- 0.01; 
   
    renderer2.render( scene, camera );
    // composer.render();

    if (retroBool ){
	vector.x = ( window.innerWidth * dpr / 2 ) - ( textureSize / 2 );
	vector.y = ( window.innerHeight * dpr / 2 ) - ( textureSize / 2 );	
	renderer2.copyFramebufferToTexture( vector, texture );
    }


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
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set( 2, 2 );
}

function retrorm(){
    scene.remove( cuboGrande ); 
}

function retroadd(){
    scene.add( cuboGrande ); 
}

/*
  function addMesh(){
  scene.add(meshFinal); 
  }

  function rmMesh(){
  scene.remove(meshFinal); 
  }
*/

function audio(){
    
    an = new Tone.Analyser('fft', 32 );
    an.smoothing = 0.99
    const mic = new Tone.UserMedia().connect( an );
    mic.open();

}

// Diseño del score: sería algo así como distribuir la totalidad de la rola en tres escenas que agregan o quitan elementos 

function score(){

    let metaContador = 0; 
    
    let contador = 0;
    let sw = true;
    let conti = true; 
    
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

	    /*
	    osc2.on('open', () => {
		const message = new OSC.Message('/test', 12.221, 'hello')
		osc2.send(message);
		})
	    */

	    send = (address = "", args) => {
		var message = new OSC.Message(address, args)
		osc2.send(message);
	    }
	    
	    // execute this line to send an osc message
	    send('/regreso', "////Terminó la vuelta "+metaContador+"////");
	    
	    // }
	}

	// console.log(contador); 
	
    }, "0.2"); // 50 segundos x ( 7 - 8 ) = ( 5.8 - 6.6 )  min 

    Tone.Transport.start();
    
}

function rtSph(){
    material.map = vit; 
    materialC2.map = texture;
}

function rtCub(){
    material.map = texture;
    materialC2.map = vit; 
}
