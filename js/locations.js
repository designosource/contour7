//4.
//aparte locatie selecteren    
function locInfo(jsonObject, pos,id){
    var loc = jsonObject[pos];
    var locNaam = loc.name_nl;
    var locAdres = loc.address_nl;
    var locDescr = loc.description_nl;
    var locImage = loc.image;
    var art = "";
          
    $('.location_header h2').html(locNaam);
    $('#location_address').html(locAdres);
    $('#location_description').html(locDescr);

    $.each(loc.artworks, function(a, artwork) {
      art += "<li>"+
             "<img src='"+artwork.image+"'>"+
             "<div>"+
                "<h3>"+artwork.name_nl+"</h3>"+
                "<p>"+artwork.artist['name']+"</p>"+
             "</div>"+
             "</li>";
    });    
    $('.art_lists').html("<ul>"+art+"</ul>");
    $('.location_number').html("[<span>" + id + "</span>]");
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

if(typeof(Storage) !== "undefined") {
    if (localStorage.getItem('contour_data') === null) {
        window.location="/";
    } else {
        var jsonObject = JSON.parse(localStorage.getItem('contour_data'));

        var idLoc = getUrlVars()["id"];
        if( idLoc != "") {
            var pos = idLoc - 1;
            locInfo(jsonObject, pos,idLoc); 
        }
    }
} else {
    alert('Could not be cached');
}