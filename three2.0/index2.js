
Promise.all([
    Promise.all([
	new Promise(function(res, rej){
	    setTimeout(function(){
		console.log("termino el mesh1");
		res("mesh1");
	    }, 2000 )  
	}),
	new Promise(function(res, rej){
	    setTimeout(function(){
		console.log("termino el mesh2");
		res("mesh2");
	    }, 4000 )  
	})
    ]),

    new Promise(function(res, rej){
	setTimeout(function(){
	    console.log("audiooooos, miau");
	    res("audios cargando"); 
	}, 5000 )
    })
    
]).then(function(objeto){
    console.log(objeto);

    //audio.play();
    
    setTimeout(function(){
	// video.play();
	console.log("gamepads"); 
    }, 8000); 
 
})
