//-----------------------------------------------
var fs = require("fs")
var path = require('path')
//-----------------------------------------------
exports.getBiblioteca = function(srcpath){
	return fs.readdirSync(srcpath).filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory());
}

exports.getAlbum = function(srcpath){
	return fs.readdirSync(srcpath).filter(function(item){ var str_pos = item.indexOf(".mp3"); return str_pos === -1 ? false : true });
}

exports.getCover = function(srcpath){
	return fs.readdirSync(srcpath).filter(function(item){ var str_pos = item.indexOf("Cover.jpg"); return str_pos === -1 ? false : true });
}