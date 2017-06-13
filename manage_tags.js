//-----------------------------------------------
const EventEmitter = require('events').EventEmitter;

var util = require("util");
//-----------------------------------------------

//-------------------------------------------------------------
//tags de los audios para hacer una mejor clasificación
//de los mismos.
//var Promise = require('promise');

var id3 = require('id3js');
//var read = Promise.denodeify(fs.readFile)
//var promise_id3 = Promise.denodeify(id3);
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
        }

    ],

}*/
//const emisorId3 = new EventEmitter();

var getMapaBiblioteca = function(arr){
	var self = this;
    var tamanio = arr.length;
    //https://nodejs.org/api/events.html#events_class_eventemitter

    var artists = [],
    	albums = [];


    var f_artists = [];

    arr.forEach(function(path_song, index){
        /**/
        id3({ file: path_song, type: id3.OPEN_LOCAL }, function(err, tags) {
            
            //console.log(tags)

            var artista = tags.artist ? tags.artist.replace(/\0/g, '') : "Artista Desconocido";

            var album = tags.album ? tags.album.replace(/\0/g, '') : "Album Desconocido";

            if (artists.indexOf(artista) === -1) {
                
                artists.push(artista)

                //console.log(albums)
            }


            if (albums.indexOf(album) === -1) {
                albums.push(album)

                //f_artists.name[artista].albums.push({"name":album})
            }

            

            //console.log(artists)

            //si el index + 1 === tamanio quiere decir que ya acabo
            //de recorrer el arreglo y de ejecutar todas las peticiones
            //de lectura de tags.
            if(index+1 === tamanio){

                console.log("Termino de armar el array.")

                artists.forEach( function(element, index) {
                	f_artists.push({"name":element, "albums":[]})
                });

                self.emit('artistsReady', f_artists);
            }
        });
        //console.log(index)
        //artists.push(index)
    })
    /*
    emisorId3.on('artistsReady', function(artists) {
        console.log("Se emite el evento artistsReady.");
        console.log(artists)
    });*/

}

util.inherits(getMapaBiblioteca,EventEmitter);

module.exports = getMapaBiblioteca;