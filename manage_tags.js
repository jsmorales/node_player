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
	var self = this;
    var tamanio = arr.length;    

    var artists = [],
    	albums = [];


    var f_artists = [];

    arr.forEach(function(path_song, index){

        /**/
        id3({ file: path_song, type: id3.OPEN_LOCAL }, function(err, tags) {
            
            var artista = tags.artist ? tags.artist.replace(/\0/g, '') : "Artista Desconocido";

            var album = tags.album ? tags.album.replace(/\0/g, '') : "Album Desconocido";

            var path_album = path_song.replace(/\/+[\d.-\w()\'& ,;\\]+(.mp3)\b/g, '');

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


            if(index+1 === tamanio){

                console.log("Termino de armar el array.")                

                self.emit('artistsReady', f_artists);
            }
        });
        
    })
    /*
    emisorId3.on('artistsReady', function(artists) {
        console.log("Se emite el evento artistsReady.");
        console.log(artists)
    });*/

}

util.inherits(getMapaBiblioteca,EventEmitter);

module.exports = getMapaBiblioteca;