var express = require("express")
var app = express()
//var fs = require('fs')
//-------------------------------------------------------------


var body_parser   = require('body-parser')
app.use(body_parser()) //Express 4

var multipart = require('connect-multiparty')
app.use(multipart()) //Express 4


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
app.use('/js', express.static(__dirname + '/js'));

//es necesaria para poder hacer la subida de archivos con NodeJS y Express
//app.use(express.multipart());
//-------------------------------------------------------------
app.get('/',function(req,res){

	var paths = manage_files.getPathsSongs(path_biblioteca);

	console.log(paths)
	/**/
	var artistas = new getMapaBiblioteca(paths);

	artistas.on('artistsReady', function(artists) {
		console.log("los artistas son:--> ")
		console.log(artists)
		res.render('home.ejs', {"artists":artists,"lista_canciones":false});
	});	
	
});

app.get('/reproductor', function(req,res){

	//res.addHeader("Access-Control-Allow-Origin", "*");
	

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

	//console.log(paths)

	var artistas = new getMapaBiblioteca(paths);

	artistas.on('artistsReady', function(artists) {
		console.log("los artistas son:--> ")
		console.log(artists)
		res.render("home.ejs", {"artists":artists,"info":createInfo(nombre_album, anio_album, nombre_artista, genre),"cover":createCover(nom_directory, path_album),"lista_canciones":createListaCanciones(lista_audio,nom_directory)});
	});
})


function createDivColMd(md, contenido, arr_clases){
	var clases = arr_clases.join(" ");

	return '<div class="col-md-'+md+' '+clases+'">'+contenido+'</div>';
}

//----------------------------------------------------------------------
function createInfo(nombre_album, anio_album, nombre_artista, genre){
	return "<ul class='info-album list-group'> <li class='list-group-item'> Artista: "+nombre_artista+" </li> <li class='list-group-item'> Album: "+nombre_album+"</li> <li class='list-group-item'> Género: "+genre+"</li> <li class='list-group-item'> Año: "+anio_album+"</li> </ul>";
}

function createCover(nombre, path_album){

	//console.log(manage_files.getCover(path_album).length)
	
	var src = manage_files.getCover(path_album).length > 0 ? "/public/music/"+nombre+"/"+manage_files.getCover(path_album)[0] : "/img/missing.png";

	return "<img class='img-responsive img-cover' src='"+src+"' height='300' width='300'>";
}

function createListaCanciones(lista, nombre_album){

	var res = "<div class='lista-canciones'>";

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

app.get('/add_album', function(req, res){
	res.render('add_album.ejs',{"notification":{"estado":"ok","mensaje":"Listo para subir archivos."}})
})

app.post('/upload', function(req, res) {
   //El modulo 'fs' (File System) que provee Nodejs nos permite manejar los archivos
   var fs = require('fs')
   

   var archivos = req.files.archivo
   var nom_carpeta = req.body.nom_album

   fs.mkdirSync(__dirname+'/public/music/'+nom_carpeta);

   //var newPath = './public/music/'+nom_carpeta+'/'+nom_original
   var newPath = './public/music/'+nom_carpeta+'/'

   archivos.forEach(function(element, index){

   	   var path = element.path
	   var nom_original = element.originalFilename  
	   
	   var is = fs.createReadStream(path)
	   var os = fs.createWriteStream(newPath+nom_original)

	   //crear el directorio en donde va el album

	   is.pipe(os)

	   is.on('end', function() {
	      //eliminamos el archivo temporal
	      fs.unlinkSync(path)
	   })
	    
   })

   //var dir = __dirname + '/upload';

	//if (!fs.existsSync(newPath)) {
		//crea el directorio
	    //fs.mkdirSync(__dirname+'/public/music/'+nom_carpeta);
	//}

   res.render('add_album.ejs',{"notification":{"estado":"ok","mensaje":"Archivos subidos con éxito."}})
})

//-------------------------------------------------------------
app.listen(3000, function(){
	console.log("node-player: online.")
})
//-------------------------------------------------------------