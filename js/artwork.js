//5.
//aparte kunstwerk informatie selecteren
$(document).ready(function(){
    var idLoc;
    var artID;
    var pos;
    var artpos;   
    console.log('ready');

    //showing information    
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
    
    //artwork animation
    $('.artwork').hide();
    function artAnimate(){
      $('.artwork').addClass('slideLeftAni');
      $('.artwork').removeClass('slideRightAni');
      $('.artwork').removeClass('slideRight');    
      $('.artwork').show();
      $('.datacontainer').css('zIndex', '25');
      setTimeout( function(){
           $('.artwork').removeClass('slideLeftAni');
           $('.artwork').addClass('slideLeft');
       },1000);  
    }
    
    $('.artwork_header').on('click', function(){
        $('.artwork').addClass('slideRightAni');
        $('.artwork').removeClass('slideLeftAni');
        $('.artwork').removeClass('slideLeft');
        setTimeout( function(){
            $('.datacontainer').css('zIndex', '20');
            $('.artwork').removeClass('slideRightAni');
            $('.artwork').addClass('slideRight');
            $('.artwork').hide();
        },1000);

    });
    
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
                artAnimate();
            });
        }
    } else {
        alert('Could not be cached');
    }
    
});