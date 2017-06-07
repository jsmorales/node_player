//-----------------------------------------------
var fs = require("fs")
var path = require('path')
//-----------------------------------------------
exports.getListaAlbums = function(srcpath){
	return fs.readdirSync(srcpath).filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory());
}