//-----------------------------------------------
var fs = require("fs")
var path = require('path')
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

        })
        //--------------------------------------
    })

    return paths_songs;   
}

var rimraf = require('rimraf');


exports.removeAlbum = function(path){

    var res = rimraf(path, function(err, msj){
        if (err) {
            throw err;
        } else {
            console.log(msj)
        }
    });
}