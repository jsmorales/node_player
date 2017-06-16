(function(){

	self.metallum = function(){
		this.api_key = "8a7c466c-52a7-4cdb-ab96-5f30876eed17";
		this.arr_search_types = ["band_name",
								 "band_genre",
								 "band_themes",
								 "album_title",
								 "song_title",
								 "label_name",
								 "artist_alias"
								];
		this.btn_busca = $("#btn_search_band");
	}

	self.metallum.prototype = {

		_search: function(type, term){
			
			return $.ajax({
			  type: "GET",
			  async: false,
			  cache: false,	          
			  url: 'http://em.wemakesites.net/search/'+type+'/'+term+'?api_key=8a7c466c-52a7-4cdb-ab96-5f30876eed17',
			  dataType: 'jsonp',
			  crossDomain: true,
			  
			});
		},
		init: function(){

			var self = this;

			this.btn_busca.click(function(event) {
				//search-type
				console.log($(this).data('name-band'))
				console.log($(this).data('search-type'))

				self.searchBy($(this).data('search-type'), $(this).data('name-band'));
			});
		},
		searchBy: function(type, term){

			var res = this._search(type, term);

			res.done(function(data){
				console.log(data)
			})
		}
	}

})();