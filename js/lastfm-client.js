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
var artistName = "Paul Van Dyk";
var tm;

var json = { "children": [
    
  ],
  "data": {
  },
  "id": "root",
  "name": artistName + " Top Albums"
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

  document.getElementById("loading").className = "loading-visible";

  if(!tm){
    initTreemap();
  }
 /* Load some artist info. */
  lastfm.artist.getTopAlbums({artist: artistName}, {success: parseTopAlbums, error:errorHandler });

};

function errorHandler(code, message) {
  $("#log").append("Error code:" + code + ". " + message + "<br />");
};

function parseAlbumInfo(albumInfo){
  //$("#output").append(albumInfo.album.playcount + "<br />");
  
  json.children[albumCount].data["$area"] = albumInfo.album.playcount;
  json.children[albumCount].data["$color"] = calculateColor(albumInfo.album.playcount, albumInfo.album.listeners);

  json.children[albumCount].data.playcount = albumInfo.album.playcount;
  json.children[albumCount].data.listeners = albumInfo.album.listeners;
  
  if(albumInfo.album.image.length > 0){
    json.children[albumCount].data.image = albumInfo.album.image[0]["#text"];
  }
  if(++albumCount == json.children.length){
     treeMapLoadJSON();
  }

};

function calculateColor(playcount, listeners) {

 var ratio = Math.floor(playcount / listeners);
 
if(ratio <= 2){
    return "#FFFFCC";
}
if(ratio <= 4){
    return "#C7E9B4";
}
if(ratio <= 6){
    return "#7FCDBB";
}
if(ratio <= 8){
    return "#41B6C4";
}
if(ratio <= 10){
    return "#2C7FB8";
}
return "#253494";



 //if(ratio > 0 && ratio < 5){
 //   return "#FDE0DD";    
 //} else if(playcount > 50001 && playcount < 100000){
 //   return "#FA9FB5";
 //} else {
 //   return "#C51B8A";
// }
}

function parseAlbum(i, album){

  //$("#output").append(album.name + "<br />");
  
  lastfm.album.getInfo({artist: artistName, album: album.name}, {success: parseAlbumInfo, error:errorHandler });

  var imageURL;

  if(album != undefined && album.name != undefined && album.playcount != undefined ){

    if(album.image.length > 0){
        imageURL = album.image[album.image.length - 1]["#text"];
      }

      var jsonAlbum = { "children": [
                            ],
                            "data": {
                              "playcount": album.playcount,
                              "listeners": 0,
                              "$color": "#FDE0DD",
                              "image": imageURL,
                              "$area": album.playcount
                            },
                            "id": album.name,
                            "name": album.name
                        };

      json.children[json.children.length] = jsonAlbum;
  }
  
  
  console.log(json);   

  // if(albumCount == json.children.length){
  //   treeMapLoadJSON();
  // }

};
/**
 *
 *
 */
function parseTopAlbums(data){
 
  if(data.topalbums.album){

    /** Cheks if there are just one album*/
    if(data.topalbums.album.length != undefined){
      //albumCount = data.topalbums.album.length;
      jQuery.each(data.topalbums.album, parseAlbum);

    }else{
      //albumCount = 1;
      parseAlbum(0, data.topalbums.album);
    }
  }else{
      $("#output").append("No albums for " + artistName + "<br />");
  }

};

function treeMapLoadJSON(){
  tm.loadJSON(json);
  tm.refresh();
  document.getElementById("loading").className = "loading-invisible";
}

function initTreemap(){
  
  //end
  //init TreeMap
  tm = new $jit.TM.Squarified({
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
          html += "play count: " + data.playcount + " <br />";
        }
        if(data.listeners) {
          html += " listeners count: " + data.listeners;
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
  // tm.loadJSON(json);
  // tm.refresh();
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

function onChangeArtist(){
  var text = document.getElementById('artist');
  //$("#output").append(text.value + "<br />");
  
  artistName = text.value;
  albumCount = 0;

  json = { "children": [
    
  ],
  "data": {
  },
  "id": "root",
  "name": artistName + " Top Albums"
};

  init();
}
