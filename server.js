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

//--------------------------------------------------------------
//manejo de ejecucion de comandos shell
var exec_shell = require("./manage_exec_shell.js")
//--------------------------------------------------------------

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

	//console.log(paths.length)

	if (paths.length !== 0) {

		var	artistas = new getMapaBiblioteca(paths);


		artistas.on('artistsLoad', function(){
			console.log("Cargando Artistas...")
		})

		artistas.on('artistsReady', function(artists) {
			console.log("los artistas son:--> ")
			console.log(artists)
			res.render('home.ejs', {"artists":artists,"lista_canciones":false});
		});	

	} else {
		res.render('home.ejs', {"artists":false,"lista_canciones":false});
	}
	
});

//-------------------------------------------------------------

//-------------------------------------------------------------

app.get('/reproductor', function(req,res){

	//res.render('home.ejs', {"artists":false,"lista_canciones":false});	

	var nom_directory = req.query.path_album.replace(/\/+\w+\/+\w+\/+\w+\/+\w+\/+/g, ''),
		path_album = req.query.path_album,
		nombre_album = req.query.nombre_album,
		anio_album = req.query.anio,
		nombre_artista = req.query.nombre_artista,
		genre = req.query.genre,
		lista_audio = manage_files.getAlbum(req.query.path_album),
		paths = manage_files.getPathsSongs(path_biblioteca),
		artistas = new getMapaBiblioteca(paths);



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

app.get('/remove_album', function(req, res){
	
	var path = req.query.path

	console.log(path)

	manage_files.removeAlbum(path);

	res.render('remove_album.ejs', {"mensaje":"El album "+path+" ha sido eliminado."})
})

app.get('/add_album', function(req, res){
	res.render('add_album.ejs',{"notification":{"estado":"ok","mensaje":"Listo para subir archivos."}})
})

app.post('/upload', function(req, res) {
   //El modulo 'fs' (File System) que provee Nodejs nos permite manejar los archivos
   var fs = require('fs')
   

   var archivos = req.files.archivo
   var nom_carpeta = req.body.nom_artista+" - "+req.body.nom_album

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

   
   res.render('add_album.ejs',{"notification":{"estado":"ok","mensaje":"Archivos subidos con éxito."}})
})

//informacion de la app ---------------------------------------
app.get('/info_app', function(req, res){

	
	var objt_disco = {
		"tam":exec_shell.getTamanioDisco("/"),
		"usado":exec_shell.getUsadoDisco("/"),
		"disponible":exec_shell.getDisponibleDisco("/"),
		"uso_per":exec_shell.getUsoPerDisco("/")		
	}

	var objt_disco_home = {
		"tam":exec_shell.getTamanioDisco("/home"),
		"usado":exec_shell.getUsadoDisco("/home"),
		"disponible":exec_shell.getDisponibleDisco("/home"),
		"uso_per":exec_shell.getUsoPerDisco("/home")		
	}
	

	res.render("info_app.ejs", {"info_disco":objt_disco, "info_disco_home":objt_disco_home,"uso_app":exec_shell.getUsoApp()})
})
//-------------------------------------------------------------
/*
Puertos: 
local - 3000
c9 - process.env.PORT, process.env.IP
*/
app.listen(3000, function(){
	console.log("node-player: online.")
})
//-------------------------------------------------------------