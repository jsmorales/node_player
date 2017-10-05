$(function(){

	//console.log("Hola reproductor")
	//--------------------------------------------------------------------------------
	self.audio_player = new audioPlayer();
	audio_player.initAudioPlayer()

	/*
	self.metallum_api = new metallum();
	metallum_api.init()*/

	$(".btn-delete-dir").click(function(event) {

		console.log($(this).data('path'))
		console.log($(this).data('nom-album'))

		var confirma = confirm("Realmente desea eliminar el album "+$(this).data('nom-album')+"?")

		if (confirma) {
			window.location = "/remove_album?path="+$(this).data('path')
		}

		return false;
	});

})
