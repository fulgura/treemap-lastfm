
function init() {


/* Create a cache object */
  var cache = new LastFMCache();

/* Create a LastFM object */
  var lastfm = new LastFM({
    apiKey    : '3cd3f363864345e489dc98b3c2eb64b0',
    apiSecret : '0c32723a33b58a523da492312a03b311',
    cache     : cache
  });

  /* Load some artist info. */
  lastfm.artist.getTopAlbums({artist: 'zappa'}, {success: function(data){
    /* Use data. */
    //alert(data.topalbums);
    jQuery.each(data.topalbums.album, function(i, album) {
        $("#output").append(album.name + "<br />");

         lastfm.album.getInfo({artist: 'zappa', album:album.name }, {success: function(albumInfo){
            
              $("#output").append(albumInfo.album.playcount + "<br />");
            
            }, error: errorHandler
          });
    });


  }, error:errorHandler
  });
}

function errorHandler(code, message) {
  alert(code + ". " + message);
};
