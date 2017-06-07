var express = require("express")
var app = express()
//-------------------------------------------------------------

//-------------------------------------------------------------
//instancia lector de directorios
var manage_files = require("./manage_files")
//var path_biblio = "/home/johan/Descargas/Metal"
///home/johan/Descargas/Metal/Decapitated/Decapitated - Nihility (2002)/06 - Spheres Of Madness.mp3
//var path_song = "/home/johan/Descargas/Metal/Decapitated/Decapitated - Nihility (2002)/06 - Spheres Of Madness.mp3"
//-------------------------------------------------------------

// se declara el directorio public para uso de almacenamiento
// de archivos estaticos
app.use('/public', express.static(__dirname + '/public'));

//-------------------------------------------------------------
app.get('/',function(req,res){
	
	return res.redirect('/public/home.html');

});

/*
Se declaran la peticion que va a hacer que se reproduzca la canción
*/

app.get('/music', function(llamado, respuesta){

	var id_archivo = llamado.query.id;

	//console.log(" ")
})


//-------------------------------------------------------------
app.listen(3000, function(){
	console.log("node-player: online.")
})
//-------------------------------------------------------------