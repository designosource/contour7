//4.
//aparte locatie selecteren  
$(document).ready(function(){
var idLoc;
var pos;
var locationList = $('#locations_list');
var locationHead = $('.locations_header');    

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
    
//slide in view animation function
$('.location').hide();  
function locAnimate(){
   $('.location').show();
   $('.datacontainer').css('zIndex', '20');    
   $( ".location" ).animate({
        left: "0"
    }, 2000, function() {
    // Animation complete.
    });    
} 
    
//slide back out of view on click
$('.location_header').on('click', function(){
    $( ".location" ).animate({
        left: '100%'
    }, 1000, function() {
    // Animation complete.
        $('.location').hide();
        $('.datacontainer').css('zIndex', '-20');
    });
      
});  
    
//menu sliding down
function menuAnimate(){
    if(locationHead.hasClass('active')) {
            locationList.slideUp('slow', function(){});
            locationHead.removeClass('active'); 
            locationHead.find('h2').css("background-image","url(images/arrow-up.png)");
        }
        else {
            locationList.slideDown('slow', function(){});
            locationHead.addClass('active'); 
            locationHead.find('h2').css("background-image","url(images/arrow-down.png)");
        }
}    
    
if(typeof(Storage) !== "undefined") {
    if (localStorage.getItem('jsondata') === null) {
        window.location="/";
    } else {
        var jsonObject = JSON.parse(localStorage.getItem('jsondata'));
        $('.locations_item').on('click', function(){
            idLoc = $(this).attr('id');
            console.log(idLoc);
            pos = idLoc - 1; 
            locInfo(jsonObject, pos,idLoc); 
            menuAnimate();
            locAnimate();
        });
        
        
        
    }
} else {
    alert('Could not be cached');
}
});
    