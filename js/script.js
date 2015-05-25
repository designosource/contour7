$(document).ready(function(){
    console.log('Version 0.5.1');
    
    //Variables
    var executed = false;
    
    //Map initializer
    $(".mapcontainer").mapael({
        map : {
            name : "mechelen",
            zoom : { enabled : true, maxLevel : 10, mousewheel : true },
        },
        areas: {
            "groen" : { attrs : { fill : "#129764" } },
            "water" : { attrs : { fill : "#6283c2" } },
            "straat" : { attrs : { fill : "#fff" } },
            "straatnaam" : { attrs : { fill : "#666666" } },
            "parkwaternaam" : { attrs : { fill : "#fff" } }
        }
    });
    
    /*JQuery OVERZICHT:
          1. Add Locations + popup
          2. Locations Menu
          3. Menu animatie
          4. Info per locatie*/
    
    //Handle JSON object
    function handleLocations(jsonObject) {
        
        var updatedOptions = {areas: {}, plots: {}};
        var deletedPlots = [];
		var newPlots = {};
        var locations = "";
        var location = "";
        $.each(jsonObject, function(i, item) {
            //1. Add Locations + popup
            //Get artworks for this location
            var artworks="";
            $.each(item.artworks, function(a, artwork) {
                artworks += "<li>"+artwork.code+"</li>";
            });
            //Add Locations
            newPlots[item.code] = {
                type: "circle", 
                size: 20, 
                latitude: item.lat, 
                longitude: item.long, 
                attrs: { fill: "#2056a4" }, 
                text : {
                    content: item.id, 
                    position : "inner", 
                    attrs : { 
                        "font-size" : 14 , 
                        "font-weight" : "bold" , 
                        fill : "#fff" } },
                eventHandlers: {
                    'click touchstart': function (e, id, mapElem, textElem, elemOptions) {
                        $('#clickContent').html(
                            "<div id='testcontent'>"+
                                "<h2><a href='/location/"+item.id+"'>[ "+item.id+" ] "+item.code+"</a></h2>"+
                                "<a href='#' class='closeBtn'></a>"+
                                "<ul>"+artworks+"</ul>"+
                            "</div>"
                        );
                    }
                }
            };
            
            //2. Locations Menu
            //Get all locations
            locations += "<li class='locaties_item'><a class='loclink' href='locatie.html?id="+item.id+"'><img src='images/loc"+item.id+"_bl.png' alt='number'/><h3>"+item.code+"</h3><p id='idselect'>"+item.id+"</p></a></li>";
            $('#locaties_list').html(
                "<ul>"+locations+"</ul>"
            );
            
            //hover for locations menu
            $(".locaties_item").on('mouseover',function(){
                $(this).css({"background-color":"#2056A4"});
                $(this).find('a').css({"color":"white"});
                $(this).css({"background-image":"url(images/arrowright_w.png)"});
                var src = $(this).find('img').attr('src');
                switch(src){
                case 'images/loc1_bl.png':
                    $(this).find('img').attr('src','images/loc1.png');    
                break; 
                case 'images/loc2_bl.png':
                    $(this).find('img').attr('src','images/loc2.png');     
                break;
                case 'images/loc3_bl.png':
                    $(this).find('img').attr('src','images/loc3.png');     
                break;
                case 'images/loc4_bl.png':
                    $(this).find('img').attr('src','images/loc4.png');     
                break;
                case 'images/loc5_bl.png':
                    $(this).find('img').attr('src','images/loc5.png');     
                break;
                case 'images/loc6_bl.png':
                    $(this).find('img').attr('src','images/loc6.png');     
                break;
                case 'images/loc7_bl.png':
                    $(this).find('img').attr('src','images/loc7.png');     
                break;
                case 'images/loc8_bl.png':
                    $(this).find('img').attr('src','images/loc8.png');     
                break;        
                }
            });
            
            $(".locaties_item").on('mouseout',function(){
                $(this).css({"background-color":"#fff"});
                $(this).css({"background-image":"url(images/arrowright.png)"});
                $(this).find('a').css({"color":"#2056A4"});
                var src = $(this).find('img').attr('src');
                switch(src){
                case 'images/loc1.png':
                    $(this).find('img').attr('src','images/loc1_bl.png');    
                break; 
                case 'images/loc2.png':
                    $(this).find('img').attr('src','images/loc2_bl.png');     
                break;
                case 'images/loc3.png':
                    $(this).find('img').attr('src','images/loc3_bl.png');     
                break;
                case 'images/loc4.png':
                    $(this).find('img').attr('src','images/loc4_bl.png');     
                break;
                case 'images/loc5.png':
                    $(this).find('img').attr('src','images/loc5_bl.png');     
                break;
                case 'images/loc6.png':
                    $(this).find('img').attr('src','images/loc6_bl.png');     
                break;
                case 'images/loc7.png':
                    $(this).find('img').attr('src','images/loc7_bl.png');     
                break;
                case 'images/loc8.png':
                    $(this).find('img').attr('src','images/loc8_bl.png');     
                break;        
                }
            });
        });
           
        
        $(".mapcontainer").trigger('update', [updatedOptions, newPlots, deletedPlots, {animDuration : 1000}]);
    }
    
    //3.
    //menu animatie
    var locationList = $('#locaties_list');
    var locationHead = $('.locaties_header');
    locationList.hide();
    locationHead.on('click', function(){
        console.log('click');
        if(locationHead.hasClass('active')) {
            locationList.slideUp('slow', function(){});
            $(this).removeClass('active'); 
            $(this).find('h2').css("background-image","url(images/arrow-up.png)");
        }
        else {
            locationList.slideDown('slow', function(){});
            $(this).addClass('active'); 
            $(this).find('h2').css("background-image","url(images/arrow-down.png)");
        }
    
    });
 
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
    
    if(typeof(Storage) !== "undefined") {
        if (localStorage.getItem('jsondata') === null) {
            window.location="/";
        } else {
            var jsonObject = JSON.parse(localStorage.getItem('jsondata'));
            console.log(jsonObject);
            handleLocations(jsonObject);
            
            var idLoc = $('#idloc').text();
            console.log(idLoc);
    
            if( idLoc != "") {
                var pos = idLoc - 1;
                locInfo(jsonObject, pos,idLoc); 
    
            }
        }
    } else {
        alert('Could not be cached');
    }
    
    //Get and Update User location
    function updatePosition(currentLatitude, currentLongitude) {
        var updatedOptions = {areas: {}, plots: {}};
        var deletedPlots = ["user"];
		var newPlots = {
            "user": {
                type: "image", 
                url: "images/user_icon.svg", 
                width: 10, height: 25, 
                latitude : currentLatitude, longitude : currentLongitude, 
                text : {content: ""}
            }
		};
        
        $(".mapcontainer").trigger('update', [updatedOptions, newPlots, deletedPlots, {animDuration : 1000}]);
        
        if (!executed) {
            executed = true;
            $(".mapcontainer").trigger('zoom', {level : 10, latitude : currentLatitude, longitude : currentLongitude});
        }
	}
    
    function showPosition(position) {
            var currentLat = position.coords.latitude;
            var currentLong = position.coords.longitude;
            updatePosition(currentLat, currentLong);
            calcDistance(currentLat, 51.0288, currentLong, 4.479);
    }
    
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                showPosition,
                function(error){
                     console.log(error);
                },{ 
                    enableHighAccuracy: true
                });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
    
    //Calculate distance
    function toRad(Value) {
        return Value * Math.PI / 180;
    }
    function calcDistance(lat1, lat2, lng1, lng2) {
        var R = 6371000; // Radius of earth in km
        var dLat = toRad(lat2-lat1);
        var dLon = toRad(lng2-lng1); 
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        console.log(d);
    }
    
    //Click events
    $("#clickContent").on('click', 'a.closeBtn', function(e){
        $('#clickContent').html("");
        return false;
    });
    
    //Initial functions to be loaded
    getLocation();
});