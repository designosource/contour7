var idLoc;

function artInfo(jsonObject, pos, artpos){
    var loc = jsonObject[pos];
    var art = loc.artworks[artpos];
    $('.artwork_header').find('h2').html(art.code);
    $('.artwork_header').find('a').attr('href', "locatie.html?id="+idLoc);
    $('.artist_name').html(art.artist['name']);
    $('.artist_birth').html(art.artist['year_birth']);
    $('.artist_nat').html(art.artist['nationality_nl']);
    $('.artwork_title').html(art.name_nl);
    $('.artwork_text').html(art.description_nl);
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
        var artID = getUrlVars()["art"];
        if( idLoc != "") {
            var pos = idLoc - 1;
            var artpos = artID -1;
            artInfo(jsonObject, pos,artpos); 
        }
    }
} else {
    alert('Could not be cached');
}