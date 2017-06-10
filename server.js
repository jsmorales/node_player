var express = require("express")
var app = express()
//var fs = require('fs')
//-------------------------------------------------------------

//-------------------------------------------------------------
//tags de los audios para hacer una mejor clasificación
//de los mismos.
var id3 = require('id3js');
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

/*
-->Mapeo general de lectura de folder music

{
	artists: [
		name: 'Slayer',		
		albums: [
			{
				name: 'World Painted Blood',
				year: '2009',
				tracks: [
					{
						name: 'World Painted Blood',
						track: '1',
						src: 'ruta_archivo',
					},
				],
				genre: 'Thrash Metal',
				path: 'ruta_folder',
			},

		],

	],

}
*/

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

	console.log(path_album+"/"+lista_audio[0])

	/*Sistema lector de tags de los audios, se va a usar para hacer la clasificacion
	de los archivos y obtener los datos de cada uno sin necesidad de BD.
	*/

	id3({ file: path_album+"/"+lista_audio[1], type: id3.OPEN_LOCAL }, function(err, tags) {
	    console.log(tags)
	});

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
	return "<h3>"+nombre+"</h3> <img class='img-responsive img-thumbnail' src='/public/music/"+nombre+"/"+manage_files.getCover(path_album)+"' height='300' width='300'> ";
}

function createListaCanciones(lista, nombre_album){

	var res = "<ul class='text-left lista-canciones'>";

	lista.forEach( function(element, index) {
		res += createLiSong(element, nombre_album);
	});	

	return res+"</ul>";
}

function createUl(cont){
	return "<ul>"+cont+"</ul>";
}

function createLiSong(nombre_cancion, nombre_album){
	//<div>'+nombre_cancion+'</div> 
	return '<li> <a href="#" class="item-lista" data-src="/public/music/'+nombre_album+'/'+nombre_cancion+'" data-name="'+nombre_cancion+'">'+nombre_cancion+'</a></li>';
}

//-------------------------------------------------------------
app.listen(3000, function(){
	console.log("node-player: online.")
})
//-------------------------------------------------------------