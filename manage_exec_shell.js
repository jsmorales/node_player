var exec = require('child_process').execSync, child;

//------------------------------------------------------
exports.getInfoDisco = function(){
	return exec('df -h /');
}

exports.getTamanioDisco = function(){
	return exec("df -h / | tail -1 | awk '{print $2}'");
}

exports.getUsadoDisco = function(){
	return exec("df -h / | tail -1 | awk '{print $3}'");
}

exports.getDisponibleDisco = function(){
	return exec("df -h / | tail -1 | awk '{print $4}'");
}

exports.getUsoPerDisco = function(){
	return exec("df -h / | tail -1 | awk '{print $5}'");
}
//------------------------------------------------------

exports.getUsoApp = function(){
	return exec("du -sh");
}