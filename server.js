var express = require("express")
var app = express()
//var fs = require('fs')
//-------------------------------------------------------------

//-------------------------------------------------------------
//instancia lector de directorios
var manage_files = require("./manage_files")

var path_biblioteca = __dirname+"/public/music"

//-------------------------------------------------------------

// se declara el directorio public para uso de almacenamiento
// de archivos estaticos
app.use('/public', express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

//-------------------------------------------------------------
app.get('/',function(req,res){

	//console.log(manage_files.getBiblioteca(path_biblioteca))

	//manage_files.getPathsSongs(path_biblioteca)
	manage_files.getMapaBiblioteca(manage_files.getPathsSongs(path_biblioteca));

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

	//console.log(path_album)

	var lista_audio = manage_files.getAlbum(path_album)

	//console.log(lista_audio);

	//console.log(path_album+"/"+lista_audio[0])	

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