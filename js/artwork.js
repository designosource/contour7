//5.
//aparte kunstwerk informatie selecteren
$(document).ready(function(){
    var idLoc;
    var artID;
    var pos;
    var artpos;   
    console.log('ready');

    function artInfo(jsonObject, pos, artpos){
        var loc = jsonObject[pos];
        var art = loc.artworks[artpos];
        $('.artwork_header').find('h2').html(art.code);
        $('.artist_name').html(art.artist['name']);
        $('.artist_birth').html(art.artist['year_birth']);
        $('.artist_nat').html(art.artist['nationality_nl']);
        $('.artwork_title').html(art.name_nl);
        $('.artwork_text').html(art.description_nl);
    }

    /*function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }*/
$('.artwork').hide();
    
    if(typeof(Storage) !== "undefined") {
        if (localStorage.getItem('jsondata') === null) {
            window.location="/";
        } else {
            var jsonObject = JSON.parse(localStorage.getItem('jsondata'));

            //var idLoc = getUrlVars()["id"];
            //var artID = getUrlVars()["art"];
            $('.art_lists').on('click','li.click', function(){
                
                artID = $(this).attr('id');
                artpos = artID - 1;
                idLoc = $('.loc_number').find('span').html();
                pos = idLoc - 1; 
                artInfo(jsonObject, pos,artpos); 
            });
        }
    } else {
        alert('Could not be cached');
    }
    
});