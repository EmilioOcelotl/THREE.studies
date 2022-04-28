
let meshes = []; 

let arrayPromesas = []; 

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
	scene.add(meshes[0]);
	clonadx = meshes[contMesh].clone(); 
	//Tone.Transport.start();
	// loopOf.start(0);
	// console.log(scene);
	gltfBool= true;
	init();
    }, 8239);
  
})


/*

render(){
 
  if(meshes.length > 0){
pads(); 
}

}

*/ 
