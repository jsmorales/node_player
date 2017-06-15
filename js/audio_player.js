//http://www.developphp.com/video/JavaScript/Audio-Playlist-Array-Tutorial
(function(){
	
	self.audioPlayer = function(){
		this.audio;//objeto audio js.
		this.arr_src_playlist = [];//array almacena las url de las canciones.
	}

	self.audioPlayer.prototype = {

		initAudioPlayer: function(){
			//llenar lista
			this.setSrcPlaylist()
			//iniciar el objeto audio
			this.initAudioObject()
			//setear el primero de la lista en el objeto audio
			this.setAudioObject(0)

			//setear los eventos de los botones en el DOM
			this.setEventsDOM()	
			//setear los eventos del objeto audio
			this.setEventsAudio()
		},		
		setSrcPlaylist: function(){
			//llena la lista de canciones a reproducir desde los
			//elementos .item-lista
			var self = this;

			$.each($(".item-lista"), function(index, val) {

				$(this).attr("data-index-arr-list",index);

				self.arr_src_playlist.push({"src":$(this).data("src"), "nombre": $(this).data("name")});
			});
		},
		initAudioObject: function(){

			this.audio = new Audio();
			this.audio.loop = false;			
		},
		playAudio: function(){
			
			var self = this;

			$("#btn_play").html('<span class="glyphicon glyphicon-time"></span>')
						
			self.audio.play()

		},
		setAudioObject: function(index_song){
			//define los parametros en el objeto audio para poder reproducir
			//todo dentro de lo almacenado en el array de lista de canciones
			try {
				this.audio.src = this.arr_src_playlist[index_song].src;
				this.audio.name_song = this.arr_src_playlist[index_song].nombre;
				this.audio.index_arr_playlist = index_song;
			} catch(e) {					
				console.log(e);
				console.log("Ya no se puede pasar de canción.");								
			}
			
		},
		setEventsDOM: function(){

			var self = this;

			self.setBtnPlayPause("play")			

			$("#btn_forward").click(function(event) {			
				
				self.audio.pause()
				
				setTimeout(function(){			
					self.playForwardBackward("forward")
				}, 1000)/**/
			});

			$("#btn_backward").click(function(event) {
				
				self.audio.pause()

				setTimeout(function(){			
					self.playForwardBackward("backward")
				}, 1000)/**/			
			});
			/**/
			$(".item-lista").click(function(event) {

				var item = $(this).data("index-arr-list")

				self.audio.pause()
				
				setTimeout(function(){
					self.setAudioObject(item);
					self.playAudio()
				}, 1000)/**/

				return false;
			});
		},		
		setEventsAudio: function(){

			var self = this;

			//play
			this.audio.addEventListener("play", function(event){
		
				console.log("Reproduciendo...")
				
				self.listActiveInactive("active")

				self.setBtnPlayPause("pause")
				self.setTitleSong()
			})

			//pause
			this.audio.addEventListener("pause", function(){
		
				console.log("Pausado...")

				self.listActiveInactive("inactive")				

				self.setBtnPlayPause("play")

				//si al pausar el current_time es igual al duration time
				//pasa a la siguiente cancion en el array
				self.validateNextSong()
			})

			this.audio.addEventListener("timeupdate", function(){				
				self.seektimeupdate();
			})

			this.audio.addEventListener("progress", function(){
				console.log("Progress...")
				$(".alert").html("Progress...")
			})

			this.audio.addEventListener("loadeddata", function(){
				console.log("Cargó...")
				$(".alert").html("Canción OK [loadeddata]")
			})

			this.audio.addEventListener("load", function(){
				console.log("load...")
				$(".alert").html("load...")
			})

			//suspend
			this.audio.addEventListener("suspend", function(){
				console.log("suspend...")
				$(".alert").html("Canción OK [suspend]")
			})

			//waiting
			this.audio.addEventListener("waiting", function(){
				console.log("waiting...")
				$(".alert").html("Waiting...")
			})

		},		
		setTitleSong: function(){
			//titulo cancion
			$(".panel-title").html(this.audio.name_song)			
		},
		setBtnPlayPause: function(type){
			//el tipo puede ser play o pause
			var self = this;

			//cambio de funcionalidad e icono del boton de accion
			$("#btn_play").html('<span class="glyphicon glyphicon-'+type+'"></span>');
			
			$("#btn_play").unbind('click');

			$("#btn_play").click(function(event) {
				
				switch (type) {
					case "play":
							self.playAudio()
						break;
					case "pause":
							self.audio.pause()
						break;
				}
			});

		},
		canPlay: function(next_index){

			var index_play = this.audio.index_arr_playlist;
				
			var llaves = Object.keys(this.arr_src_playlist);

			if (llaves.indexOf(next_index.toString()) != -1) {
				console.log("Se puede reproducir [index_arr_playlist existe.]")
				console.log(next_index)
				this.setAudioObject(next_index);
				this.playAudio()
			} else {
				console.log("No se puede reproducir [index_arr_playlist no existe.]")
				this.audio.pause();
			}

		},
		playForwardBackward: function(type){

			var next_index;

			switch (type) {
				case "forward":
						next_index = this.audio.index_arr_playlist + 1;
					break;
				case "backward":
						next_index = this.audio.index_arr_playlist - 1;
					break;					
			}				

			this.canPlay(next_index);

		},
		seektimeupdate: function(){

			var nt = this.audio.currentTime * (100 / this.audio.duration);
			$("#seekslider").val(nt)

			$(".progress-bar").css('width', nt+'%');

			var curmins = Math.floor(this.audio.currentTime / 60);
		    var cursecs = Math.floor(this.audio.currentTime - curmins * 60);
		    var durmins = Math.floor(this.audio.duration / 60);
		    var dursecs = Math.floor(this.audio.duration - durmins * 60);

			if(cursecs < 10){ cursecs = "0"+cursecs; }
		    if(dursecs < 10){ dursecs = "0"+dursecs; }
		    if(curmins < 10){ curmins = "0"+curmins; }
		    if(durmins < 10){ durmins = "0"+durmins; }
							
			$("#curtimetext").html(curmins+":"+cursecs);			    
		    $("#durtimetext").html(durmins+":"+dursecs);
		},
		validateNextSong: function(){
			
			if (this.audio.currentTime === this.audio.duration) {
				this.playForwardBackward("forward")
			}
		},
		listActiveInactive: function(type){
			//el tipo puede ser activo o inactivo
			//selecciona el audio que se esta reproduciendo
			var self = this;

			$.each($(".item-lista"), function(index, val) {
				
				
				if ($(this).data("index-arr-list") === self.audio.index_arr_playlist) {
					
					console.log(self.audio.index_arr_playlist)
					console.log($(this).data("index-arr-list"))
					console.log(type)

					switch (type) {
						case "active":
								$(this).addClass('list-active')
							break;
						case "inactive":
								$(this).removeClass('list-active')
							break;removeClass
					}
				}
			});
		},
		
	}

})();