var exec = require('child_process').execSync, child;

//------------------------------------------------------
exports.getInfoDisco = function(){
	return exec('df -h /');
}

exports.getTamanioDisco = function(particion){
	return exec("df -h "+particion+" | tail -1 | awk '{print $2}'");
}

exports.getUsadoDisco = function(particion){
	return exec("df -h "+particion+" | tail -1 | awk '{print $3}'");
}

exports.getDisponibleDisco = function(particion){
	return exec("df -h "+particion+" | tail -1 | awk '{print $4}'");
}

exports.getUsoPerDisco = function(particion){
	return exec("df -h "+particion+" | tail -1 | awk '{print $5}'");
}
//------------------------------------------------------

exports.getUsoApp = function(){
	return exec("du -sh");
}