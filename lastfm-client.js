
function init() {

	$(document).ready(function()
	{
	  $.ajax({
	    type: "GET",
	    url: "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=zappa&api_key=b25b959554ed76058ac220b7b2e0a026&format=json",
	    dataType: "json",
	    success: parseJSON
	  });
	});

}

function parseJSON(json)
{


  
   
   jQuery.each(json.topalbums.album, function(i, album) {
    
      //alert(album.name);
     $("#output").append(album.name + "<br />");
      
      //$("#" + i).append(document.createTextNode(" - " + val));

    });
   
   //$.each( json.topalbums.album, function(i,album){
              
    //          alert(album.name);

    //}):

  //find every Tutorial and print the author
  //$(xml).find("album").each(function()
  //{
  //  $("#output").append($(this).find("name").text() + "<br />");

  //});

  // Output:
  // The Reddest
  // The Hairiest
  // The Tallest
  // The Fattest
}
