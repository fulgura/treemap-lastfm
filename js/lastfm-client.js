
var albumCount = 0;

var json = { "children": [
    
  ],
  "data": {
  },
  "id": "root",
  "name": "Favourite Artists"
};

$("#output").append(json + "<br />");

/* Create a cache object */
  var cache = new LastFMCache();

/* Create a LastFM object */
  var lastfm = new LastFM({
    apiKey    : '3cd3f363864345e489dc98b3c2eb64b0',
    apiSecret : '0c32723a33b58a523da492312a03b311',
    cache     : cache
  });


function init() {

 /* Load some artist info. */
  lastfm.artist.getTopAlbums({artist: 'zappa'}, {success: parseTopAlbums, error:errorHandler });

  /* Load some artist info. */
  // lastfm.artist.getTopAlbums({artist: 'madonna'}, {success: function(data){
  //   /* Use data. */
  //   //alert(data.topalbums);
  //   jQuery.each(data.topalbums.album, function(i, album) {
        
  //       $("#output").append(album.name + "<br />");

  //        lastfm.album.getInfo({artist: 'madonna', album:album.name }, {success: function(albumInfo){
            
  //             $("#output").append(albumInfo.album.playcount + "<br />");
            
  //           }, error: errorHandler
  //         });
  //   });


  // }, error:errorHandler
  // });
};

function errorHandler(code, message) {
  alert(code + ". " + message);
};

function parseAlbumInfo(albumInfo){


  $("#output").append(albumInfo.album.playcount + "<br />");
  
  albumCount++;

  if(albumCount == json.children.length){
    $("#output").append("Llamemos al mapa !!<br />");
  }               
   
};


function parseAlbum(i, album){

  $("#output").append(album.name + "<br />");
  lastfm.album.getInfo({artist: 'zappa', album:album.name }, {success: parseAlbumInfo, error:errorHandler });

  var jsonAlbum = { 
                    
                        "children": [
                        ],
                        "data": {
                          "playcount": "276",
                          "$color": "#8E7032",
                          "image": "http://userserve-ak.last.fm/serve/300x300/11403219.jpg",
                          "$area": 100
                        },
                        "id": album.name,
                        "name": album.name
                    };

  json.children[json.children.length] = jsonAlbum;
  
  console.log(json);                  
};

function parseTopAlbums(data){

      jQuery.each(data.topalbums.album, parseAlbum);

};