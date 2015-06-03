//4.
//aparte locatie selecteren  
$(document).ready(function(){
var idLoc;
var pos;

function locInfo(jsonObject, pos,id){
    var loc = jsonObject[pos];
    var locNaam = loc.name_nl;
    console.log(loc);
    var locAdres = loc.address_nl;
    var locDescr = loc.description_nl;
    var locImage = loc.image;
    var art = "";
    var artID = 0;
          
    $('.location_header h2').html(locNaam);
    $('#location_address').html(locAdres);
    $('#location_description').html(locDescr);

    $.each(loc.artworks, function(a, artwork) {
      artID += 1    
      art += "<li class='click' id="+artID+">"+
             "<img src='"+artwork.image+"'>"+
             "<a>"+
                "<h3>"+artwork.name_nl+"</h3>"+
                "<p>"+artwork.artist['name']+"</p>"+
             "</a>"+
             "</li>";
    });    
    $('.art_lists').html("<ul>"+art+"</ul>");
    $('.loc_number').html("[<span>" + id + "</span>]");
}

/*function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}*/

if(typeof(Storage) !== "undefined") {
    if (localStorage.getItem('jsondata') === null) {
        window.location="/";
    } else {
        var jsonObject = JSON.parse(localStorage.getItem('jsondata'));
        //console.log(jsonObject);
        //idLoc = getUrlVars()["id"];
        $('.locations_item').on('click', function(){
            idLoc = $(this).attr('id');
            console.log(idLoc);
            pos = idLoc - 1; 
            locInfo(jsonObject, pos,idLoc); 
        });
        
        
        
    }
} else {
    alert('Could not be cached');
}
});
    