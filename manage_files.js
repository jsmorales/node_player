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