//-----------------------------------------------
const EventEmitter = require('events').EventEmitter;

var util = require("util");
//-----------------------------------------------

//-------------------------------------------------------------
//tags de los audios para hacer una mejor clasificación
//de los mismos.
//var Promise = require('promise');
var id3 = require('id3js');
//-------------------------------------------------------------

/*
Sistema lector de tags de los audios, se va a usar para hacer la clasificacion
de los archivos y obtener los datos de cada uno sin necesidad de BD.


id3({ file: path_album+"/"+lista_audio[1], type: id3.OPEN_LOCAL }, function(err, tags) {
    console.log(tags)
});
*/

/*
-->Mapeo general de lectura de folder music

var objt_music = {
    artists: [

        {
            name: 'Slayer',     
            albums: [
                {
                    name: 'World Painted Blood',
                    year: '2009',                    
                    genre: 'Thrash Metal',
                    path: 'ruta_folder',
                },

            ],
        }

    ],

}*/

var getMapaBiblioteca = function(arr){
	
    var self = this,
        tamanio = arr.length,
        contador = 0,
        artists = [],
    	albums = [],
        f_artists = [];

    function leeMasContador(){

        id3({ file: arr[contador], type: id3.OPEN_LOCAL }, function(err, tags) {

            if (err) {
                throw err
            } else {
                //-----------------------------------------------------------
                var artista = tags.artist ? tags.artist.replace(/\0/g, '') : "Artista Desconocido";

                var album = tags.album ? tags.album.replace(/\0/g, '') : "Album Desconocido";

                var path_album = arr[contador].replace(/\/+[\d.-\w()\'& ,;\\]+(.mp3)\b/g, '');

                function artistNoExist(artista){

                    if (artists.indexOf(artista) === -1) {
                        return true;
                    }else{
                        return false;
                    }
                }

                function albumNoExist(album){

                    if (albums.indexOf(album) === -1) {
                        return true;
                    }else{
                        return false;
                    }
                }

                function createArtist(artista){

                    artists.push(artista)

                    f_artists.push({"name":artista, "albums":[]})

                    console.log(f_artists)
                }

                function createAlbum(album){

                    albums.push(album)

                    console.log(albums)

                    f_artists.forEach(function(artista_data, index){

                        if (artista_data.name === artista) {
                            
                            f_artists[index].albums.push({"name":album,"path":path_album,"year":tags.year,"genre":tags.v2.genre})   
                        }
                        
                    })
                }

                if (artistNoExist(artista)) {
                    
                    createArtist(artista)
                    
                    if (albumNoExist(album)) {
                        
                        createAlbum(album)
                    }

                }else{

                    if (albumNoExist(album)) {
                        
                        createAlbum(album)
                    }
                }
                //-----------------------------------------------------------
                self.emit('artistsContinue');
            }
        });

        //console.log(arr[374])
        console.log("Tamanio:"+tamanio+" contador: "+contador)

    }

    self.on("artistsContinue", function(){          

        if(validaArr()){
            contador++;
            leeMasContador()
            console.log("Debería ejecutar leerMasContador")
        }else{
            console.log("Termina de leer el array de paths.")
            //-----------------------------------------------
            self.emit('artistsReady', f_artists);
        }
    })

    function validaArr(){

        if ( contador !== (tamanio-1) )  {
            return true;
        } else {            
            return false;
        }
    }
        
    leeMasContador()

}

util.inherits(getMapaBiblioteca,EventEmitter);

module.exports = getMapaBiblioteca;