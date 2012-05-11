var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};
/** Global variables */
var albumCount = 0;
var artistName = "zappa";
var json = { "children": [
    
  ],
  "data": {
  },
  "id": "root",
  "name": "Favourite Artists"
};

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
  lastfm.artist.getTopAlbums({artist: artistName}, {success: parseTopAlbums, error:errorHandler });

};

function errorHandler(code, message) {
  alert(code + ". " + message);
};

function parseAlbumInfo(albumInfo){


  $("#output").append(albumInfo.album.playcount + "<br />");
  
  albumCount++;

  if(albumCount == json.children.length){
    $("#output").append("Llamemos al mapa !!<br />");
    initTreemap();
  }               
   
};


function parseAlbum(i, album){

  $("#output").append(album.name + "<br />");
  lastfm.album.getInfo({artist: artistName, album:album.name }, {success: parseAlbumInfo, error:errorHandler });

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

function initTreemap(){
  
  //end
  //init TreeMap
  var tm = new $jit.TM.Squarified({
    //where to inject the visualization
    injectInto: 'infovis',
    //parent box title heights
    titleHeight: 15,
    //enable animations
    animate: animate,
    //box offsets
    offset: 1,
    //Attach left and right click events
    Events: {
      enable: true,
      onClick: function(node) {
        if(node) tm.enter(node);
      },
      onRightClick: function() {
        tm.out();
      }
    },
    duration: 1000,
    //Enable tips
    Tips: {
      enable: true,
      //add positioning offsets
      offsetX: 20,
      offsetY: 20,
      //implement the onShow method to
      //add content to the tooltip when a node
      //is hovered
      onShow: function(tip, node, isLeaf, domElement) {
        var html = "<div class=\"tip-title\">" + node.name 
          + "</div><div class=\"tip-text\">";
        var data = node.data;
        if(data.playcount) {
          html += "play count: " + data.playcount;
        }
        if(data.image) {
          html += "<img src=\""+ data.image +"\" class=\"album\" />";
        }
        tip.innerHTML =  html; 
      }  
    },
    //Add the name of the node in the correponding label
    //This method is called once, on label creation.
    onCreateLabel: function(domElement, node){
        domElement.innerHTML = node.name;
        var style = domElement.style;
        style.display = '';
        style.border = '1px solid transparent';
        domElement.onmouseover = function() {
          style.border = '1px solid #9FD4FF';
        };
        domElement.onmouseout = function() {
          style.border = '1px solid transparent';
        };
    }
  });
  tm.loadJSON(json);
  tm.refresh();
  //end
  //add events to radio buttons
  var sq = $jit.id('r-sq'),
      st = $jit.id('r-st'),
      sd = $jit.id('r-sd');
  var util = $jit.util;
  util.addEvent(sq, 'change', function() {
    if(!sq.checked) return;
    util.extend(tm, new $jit.Layouts.TM.Squarified);
    tm.refresh();
  });
  util.addEvent(st, 'change', function() {
    if(!st.checked) return;
    util.extend(tm, new $jit.Layouts.TM.Strip);
    tm.layout.orientation = "v";
    tm.refresh();
  });
  util.addEvent(sd, 'change', function() {
    if(!sd.checked) return;
    util.extend(tm, new $jit.Layouts.TM.SliceAndDice);
    tm.layout.orientation = "v";
    tm.refresh();
  });
  //add event to the back button
  var back = $jit.id('back');
  $jit.util.addEvent(back, 'click', function() {
    tm.out();
  });
}
