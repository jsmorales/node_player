var express = require("express")
var app = express()
//var fs = require('fs')
//-------------------------------------------------------------

//-------------------------------------------------------------
//instancia lector de directorios
var manage_files = require("./manage_files")
var getMapaBiblioteca = require("./manage_tags.js")

var path_biblioteca = __dirname+"/public/music"

//-------------------------------------------------------------

// se declara el directorio public para uso de almacenamiento
// de archivos estaticos
app.use('/public', express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/img', express.static(__dirname + '/img'));

//-------------------------------------------------------------
app.get('/',function(req,res){

	var paths = manage_files.getPathsSongs(path_biblioteca);

	console.log(paths)

	var artistas = new getMapaBiblioteca(paths);

	artistas.on('artistsReady', function(artists) {
		//console.log(artists)
		res.render('home.ejs', {"artists":artists,"lista_canciones":false});
	});	
	
});

app.get('/reproductor', function(req,res){

	var nom_directory = req.query.path_album.replace(/\/+\w+\/+\w+\/+\w+\/+\w+\/+/g, '');

	var path_album = req.query.path_album;

	var nombre_album = req.query.nombre_album;

	var anio_album = req.query.anio;

	var nombre_artista = req.query.nombre_artista;

	var genre = req.query.genre;

	//console.log(path_album)

	var lista_audio = manage_files.getAlbum(req.query.path_album)

	//console.log(lista_audio);

	//console.log(path_album+"/"+lista_audio[0	

	var paths = manage_files.getPathsSongs(path_biblioteca);

	console.log(paths)

	var artistas = new getMapaBiblioteca(paths);

	artistas.on('artistsReady', function(artists) {
		//console.log(artists)
		//createAlbum(lista_audio, path_album, nom_directory, nombre_album, anio_album, nombre_artista, genre)
		res.render("home.ejs", {"artists":artists,"info":createInfo(nombre_album, anio_album, nombre_artista, genre),"cover":createCover(nom_directory, path_album),"lista_canciones":createListaCanciones(lista_audio,nom_directory)});
	});
})

//clase renderizador
function createAlbum(lista, path_album, nom_directory, nombre_album, anio_album, nombre_artista, genre){

	var res = "";
	
	res += createDivColMd(4, createCover(nom_directory, path_album), ["text-center"]);

	res += createDivColMd(4, createListaCanciones(lista, nom_directory), []);
	res += createDivColMd(4, createInfo(nombre_album, anio_album, nombre_artista, genre), ["text-center"]);

	return createDivColMd(12, res, []);
}

function createDivColMd(md, contenido, arr_clases){
	var clases = arr_clases.join(" ");

	return '<div class="col-md-'+md+' '+clases+'">'+contenido+'</div>';
}

//----------------------------------------------------------------------
function createInfo(nombre_album, anio_album, nombre_artista, genre){
	return "<ul class='info-album list-group'> <li class='list-group-item'> Artista: "+nombre_artista+"</li> <li class='list-group-item'> Album: "+nombre_album+"</li> <li class='list-group-item'> Género: "+genre+"</li> <li class='list-group-item'> Año: "+anio_album+"</li> </ul>";
}

function createCover(nombre, path_album){

	//console.log(manage_files.getCover(path_album).length)
	
	var src = manage_files.getCover(path_album).length > 0 ? "/public/music/"+nombre+"/"+manage_files.getCover(path_album)[0] : "/img/missing.png";

	return "<img class='img-responsive img-cover' src='"+src+"' height='300' width='300'>";
}

function createListaCanciones(lista, nombre_album){

	var res = "<div class='list-group lista-canciones'>";

	lista.forEach( function(element, index) {
		res += createLiSong(element, nombre_album);
	});	

	return res+"</div>";
}

function createLiSong(nombre_cancion, nombre_album){
	//<div>'+nombre_cancion+'</div> 
	return '<a href="#" class="item-lista list-group-item" data-src="/public/music/'+nombre_album+'/'+nombre_cancion+'" data-name="'+nombre_cancion+'">'+nombre_cancion+'</a>';
}
//----------------------------------------------------------------------


//-------------------------------------------------------------
app.listen(3000, function(){
	console.log("node-player: online.")
})
//-------------------------------------------------------------