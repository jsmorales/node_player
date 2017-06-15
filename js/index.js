$(function(){
	
	console.log("Hola reproductor")
	//--------------------------------------------------------------------------------
	/*API restful encyclopedia metallum
	jQuery.ajax({
	  url: 'http://em.wemakesites.net/band/186?api_key=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
	  dataType: 'jsonp',
	  crossDomain: true,
	  success: function(response) {
	    console.log(response);
	  }
	});
	*/
	//api_key
	//8a7c466c-52a7-4cdb-ab96-5f30876eed17
	self.audio_player = new audioPlayer();
	audio_player.initAudioPlayer();
})