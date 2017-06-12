//-----------------------------------------------
var fs = require("fs")
var path = require('path')
//-----------------------------------------------

//-----------------------------------------------------
//Función para ordenamiento natural de strings con numeros que le preceden
//https://stackoverflow.com/questions/15478954/sort-array-elements-string-with-numbers-natural-sort
var chunkRgx = /(_+)|([0-9]+)|([^0-9_]+)/g;

function naturalCompare(a, b) {
    var ax = [], bx = [];
    
    a.replace(chunkRgx, function(_, $1, $2, $3) {
        ax.push([$1 || "0", $2 || Infinity, $3 || ""])
    });
    b.replace(chunkRgx, function(_, $1, $2, $3) {
        bx.push([$1 || "0", $2 || Infinity, $3 || ""])
    });
    
    while(ax.length && bx.length) {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = an[0].localeCompare(bn[0]) || 
                 (an[1] - bn[1]) || 
                 an[2].localeCompare(bn[2]);
        if(nn) return nn;
    }
    
    return ax.length - bx.length;
}
//-----------------------------------------------------

exports.getBiblioteca = function(srcpath){
	return fs.readdirSync(srcpath).filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory());
}

exports.getAlbum = function(srcpath){
	return fs.readdirSync(srcpath).filter(function(item){ var str_pos = item.indexOf(".mp3"); return str_pos === -1 ? false : true }).sort(naturalCompare);
}

exports.getCover = function(srcpath){
	return fs.readdirSync(srcpath).filter(function(item){ var str_pos = item.indexOf(".jpg"); return str_pos === -1 ? false : true });
}


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


exports.getPathsSongs = function(srcpathbiblioteca){
    
    var self = this;
    //sacar todos los artistas de todas las carpetas
    //console.log(srcpathbiblioteca)
    var biblioteca = this.getBiblioteca(srcpathbiblioteca);
    //array donde se almacenan los artistas encontrados
    //en cada una de las pistas de cada carpeta.
    var paths_songs = [];

    biblioteca.forEach(function(folder, index){
        //path de cada carpeta
        //console.log(srcpathbiblioteca+"/"+folder)
        
        var album = self.getAlbum(srcpathbiblioteca+"/"+folder);

        //console.log(album)
        //--------------------------------------
        album.forEach(function(song, index){
            //leer los tags de cada song y clasificarla
            //console.log(srcpathbiblioteca+"/"+folder+"/"+song)
            paths_songs.push(srcpathbiblioteca+"/"+folder+"/"+song);
            
            /*
            var getArtists = new Promise(function(resolve, reject){

                id3({ file: srcpathbiblioteca+"/"+folder+"/"+song, type: id3.OPEN_LOCAL }, function(err, tags) {
                    //console.log(tags.artist)


                    if (err) {
                        reject(err);
                    } else {

                        var artista = tags.artist.replace(/\0/g, '');

                        if (artists.indexOf(artista) === -1) {
                            artists.push(artista)
                        }
                        
                        resolve(artists);
                    }                   

                    //console.log(artists)           
                });

            });

            
            getArtists.then(function(artistas){
                console.log(artistas)                
            })*/

        })
        //--------------------------------------
    })

    return paths_songs;   
}

exports.getMapaBiblioteca = function(arr){

    //console.log(arr.length)
    //https://nodejs.org/api/events.html#events_class_eventemitter

    var artists = [];

    var getArtists = new Promise (function(resolve, reject){

        arr.forEach(function(path_song, index){
            /**/
            id3({ file: path_song, type: id3.OPEN_LOCAL }, function(err, tags) {
                //console.log(tags.artist)

                var artista = tags.artist.replace(/\0/g, '');

                if (artists.indexOf(artista) === -1) {
                    artists.push(artista)
                }

                console.log(artists)


            });
            //console.log(index)
            //artists.push(index)
        })

        resolve(artists);
    })

    getArtists.then(function(art){
        console.log(art)
    })

}