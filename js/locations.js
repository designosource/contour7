//4.
//aparte locatie selecteren    
function locInfo(jsonObject, pos,id){
    var loc = jsonObject[pos];
    var locNaam = loc.name_nl;
    var locAdres = loc.address_nl;
    var locDescr = loc.description_nl;
    var locImage = loc.image;
    var art = "";
          
    $('.locatie_header h2').html(locNaam);
    $('#adres').html(locAdres);
    $('#beschrijving').html(locDescr);

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
            
    switch(id){
        case '1':
            $('#locImage').attr('src','images/loc1.png');    
        break; 
        case '2':
            $('#locImage').attr('src','images/loc2.png');     
        break;
        case '3':
            $('#locImage').attr('src','images/loc3.png');     
        break;
        case '4':
            $('#locImage').attr('src','images/loc4.png');     
        break;
        case '5':
            $('#locImage').attr('src','images/loc5.png');     
        break;
        case '6':
            $('#locImage').attr('src','images/loc6.png');     
        break;
        case '7':
            $('#locImage').attr('src','images/loc7.png');     
        break;
        case '8':
            $('#locImage').attr('src','images/loc8.png');     
        break;        
    }
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

if(typeof(Storage) !== "undefined") {
    if (localStorage.getItem('jsondata') === null) {
        window.location="/";
    } else {
        var jsonObject = JSON.parse(localStorage.getItem('jsondata'));

        var idLoc = getUrlVars()["id"];
        if( idLoc != "") {
            var pos = idLoc - 1;
            locInfo(jsonObject, pos,idLoc); 
        }
    }
} else {
    alert('Could not be cached');
}