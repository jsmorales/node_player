var express = require("express")
var app = express()
//var fs = require('fs')
//-------------------------------------------------------------

//-------------------------------------------------------------
//instancia lector de directorios
var manage_files = require("./manage_files")
//var path_biblio = "/home/johan/Descargas/Metal"
///home/johan/Descargas/Metal/Decapitated/Decapitated - Nihility (2002)/06 - Spheres Of Madness.mp3
//var path_song = "/home/johan/Descargas/Metal/Decapitated/Decapitated - Nihility (2002)/06 - Spheres Of Madness.mp3"
var path_biblioteca = __dirname+"/public/music"
var path_biblio = "/home/johan/Descargas/Metal"
//-------------------------------------------------------------

// se declara el directorio public para uso de almacenamiento
// de archivos estaticos
app.use('/public', express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

//-------------------------------------------------------------
app.get('/',function(req,res){

	//console.log(manage_files.getBiblioteca(path_biblioteca))

	var lista = createBiblioteca(manage_files.getBiblioteca(path_biblioteca))
	
	res.render('home.ejs', {"biblioteca":lista});
});

//clase renderizador
function createBiblioteca(lista){
	
	let res = "";

	lista.forEach( function(element, index) {
		//console.log(index)
		res += createDiv(element) 
	});

	return res;
}

//clase renderizador
function createDiv(contenido){
	return "<div><a href='/reproductor?nombre_album="+contenido+"'>"+contenido+" <span class='glyphicon glyphicon-chevron-right'></span></a> </div>";
}

app.get('/reproductor', function(req,res){

	var nom_album = req.query.nombre_album;

	var path_album = path_biblioteca+"/"+nom_album;

	console.log(path_album)

	var lista_audio = manage_files.getAlbum(path_album)

	console.log(lista_audio);

	res.render("reproductor.ejs", {"album":createAlbum(lista_audio, path_album, nom_album)});
})

//clase renderizador
function createAlbum(lista, path_album, nombre_album){

	var res = "";

	res += createTitulo(nombre_album, path_album);
	res += createListaCanciones(lista, nombre_album);

	return res;
}

function createTitulo(nombre, path_album){
	return "<h3>"+nombre+"</h3> <img src='/public/music/Decapitated-Nihility-2002/"+manage_files.getCover(path_album)+"' height='200' width='200'>";
}

function createListaCanciones(lista, nombre_album){

	var res = "";

	lista.forEach( function(element, index) {
		res += createLiSong(element, nombre_album);
	});

	//res += createUl(res);

	return res;
}

function createUl(cont){
	return "<ul>"+cont+"</ul>";
}

function createLiSong(nombre_cancion, nombre_album){
	//<div>'+nombre_cancion+'</div> 
	return '<li> <a href="#" class="item-lista" data-src="/public/music/'+nombre_album+'/'+nombre_cancion+'" data-name="'+nombre_cancion+'">'+nombre_cancion+'</a></li>';
}

/*
<h3>Decapitated - Nihility (2002)</h3>
<ul>
	<li>
		<div>06 - Spheres Of Madness.mp3</div>
		<audio controls hidden="true">							
			<source src="music/Decapitated_Nihility/06 - Spheres Of Madness.mp3">				
		</audio>

	</li>
	
	<li></li>
</ul>
*/

/*
Se declaran la peticion que va a hacer que se reproduzca la canción
*/
//Decapitated - Nihility (2002)
/*
app.get('/music/Decapitated_Nihility', function(llamado, respuesta){

	var id_archivo = llamado.query.id;

	var archivo = __dirname+'/public/music/Decapitated_Nihility/'+id_archivo;

	console.log(archivo)

	fs.exists(archivo, function(existe){

		if (existe) {
			//crea el stream y la pipe
			var lee_stream = fs.createReadStream(archivo);
			lee_stream.pipe(respuesta);

		} else {
			//de locontrario crea un mensaje de error
			respuesta.send("El archivo no existe [404].")
			respuesta.end()
		}
	})	
})*/


//-------------------------------------------------------------
app.listen(3000, function(){
	console.log("node-player: online.")
})
//-------------------------------------------------------------