$(document).ready(function(){
    console.log('Version 0.6.0');
    
    //Variables DO NOT TOUCH
    var executed = false;
    var locationCoords = [];
    var jsonObject;
    var language;
    
    //Detect the language
    function getUrlParameter(sParam)
    {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) 
        {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) 
            {
                return sParameterName[1];
            }
        }
    }
    function getLanguage() {
        if(getUrlParameter('lng')) {
            language = getUrlParameter('lng');
        } else {
            language = window.navigator.userLanguage || window.navigator.language;
        }
    }
    getLanguage();

    //Get the right translation for each field
    function getTranslation(field, language, id, artwork_id) {
        //Location translations
        if(field == 'location_name') {
            if(language == 'nl') {
                return jsonObject[id].name_nl;
            } else if (language == 'en'){
                return jsonObject[id].name_en;
            } else if (language == 'fr'){
                return jsonObject[id].name_fr;
            }
        } else if(field == 'location_address') {
            if(language == 'nl') {
                return jsonObject[id].address_nl;
            } else if (language == 'en'){
                return jsonObject[id].address_en;
            } else if (language == 'fr'){
                return jsonObject[id].address_fr;
            }
        } else if(field == 'location_description') {
            if(language == 'nl') {
                return jsonObject[id].description_nl;
            } else if (language == 'en'){
                return jsonObject[id].description_en;
            } else if (language == 'fr'){
                return jsonObject[id].description_fr;
            }
        }
        //Artwork translations
        else if(field == 'artwork_name') {
            if(language == 'nl') {
                return jsonObject[id].artworks[artwork_id].name_nl;
            } else if (language == 'en'){
                return jsonObject[id].artworks[artwork_id].name_en;
            } else if (language == 'fr'){
                return jsonObject[id].artworks[artwork_id].name_fr;
            }
        } else if(field == 'artwork_description') {
            if(language == 'nl') {
                return jsonObject[id].artworks[artwork_id].description_nl;
            } else if (language == 'en'){
                return jsonObject[id].artworks[artwork_id].description_en;
            } else if (language == 'fr'){
                return jsonObject[id].artworks[artwork_id].description_fr;
            }
        }
        //Artist translations
        else if(field == 'artist_nationality') {
            if(language == 'nl') {
                return jsonObject[id].artworks[artwork_id].artist.nationality_nl;
            } else if (language == 'en'){
                return jsonObject[id].artworks[artwork_id].artist.nationality_en;
            } else if (language == 'fr'){
                return jsonObject[id].artworks[artwork_id].artist.nationality_fr;
            }
        }
    }

    $('.language a').on('click', function(){
        console.log('lang');
        if($(this).hasClass('unselected')) {
           $(this).removeClass('unselected');
           $(this).addClass('selected');
        }
        else {
          $(this).addClass('unselected');
          $(this).removeClass('selected'); 
        }
    });
    
    //Map initializer
    $(".mapcontainer").mapael({
        map : {
            name : "mechelen",
            zoom : { enabled : true, maxLevel : 10, mousewheel : true },
        },
        areas: {
            "groen" : { attrs : { fill : "#909090" } },
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
          4. Info per locatie --> zit in locations.js*/
    
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
                        idLoc= item.id;
                        pos = idLoc - 1;
                        locInfo(jsonObject, pos,idLoc);
                        locAnimate();
                    }
                }
            };
            
            //2. Locations Menu
            //Get all locations
            locations += "<li class='locations_item' id="+item.id+"><a class='loclink'><p class='location_number'>[<span>" + item.id + "</span>]</p><h3>"+getTranslation('location_name', language, i)+"</h3></a></li>";
            $('#locations_list').html(
                "<ul>"+locations+"</ul>"
            );
        });
        $(".mapcontainer").trigger('update', [updatedOptions, newPlots, deletedPlots, {animDuration : 1000}]);
    }
    
    //3.
    //menu animatie
    var locationList = $('#locations_list');
    var locationMobileHead = $('.locations_mobileheader');
    var locationHead = $('.locations_header');
    var mobileMenu = $('.menu');

    function menuAnimate(head, menu){
        if(menu.hasClass('active')) {
                menu.removeClass('activeAni');
                menu.removeClass('active');
                menu.addClass('unactiveAni');
                head.find('h2').css("background-image","url(images/arrow-up.svg)");
                setTimeout( function(){
                menu.removeClass('unactiveAni');
                menu.addClass('unactive');     
                },1000);
            }
            else {
                menu.removeClass('unactiveAni');
                menu.removeClass('unactive');
                menu.addClass('activeAni'); 
                head.find('h2').css("background-image","url(images/arrow-down.svg)");
                setTimeout( function(){
                menu.removeClass('activeAni');
                menu.addClass('active');    
                },1000)
            }
    }
    
    function menuAnimateTablet(head, menu){
        if(menu.hasClass('active')) {
                menu.removeClass('activeAni');
                menu.removeClass('active');
                menu.addClass('unactiveAni');
                head.find('h2').css("background-image","url(images/arrow-left.svg)");
                setTimeout( function(){
                menu.removeClass('unactiveAni');
                menu.addClass('unactive');    
                },1000);
            }
            else {
                menu.removeClass('unactiveAni');
                menu.removeClass('unactive');
                menu.addClass('activeAni'); 
                head.find('h2').css("background-image","url(images/arrow-right.svg)");
                setTimeout( function(){
                menu.removeClass('activeAni');
                menu.addClass('active');    
                },1000)
            }
    }
    
    //menu animatie tablet
    locationMobileHead.on('click', function(){
        console.log('click');
        menuAnimate(locationMobileHead, mobileMenu);
    });
    
    locationHead.on('click', function(){
        console.log('click');
        menuAnimateTablet(locationHead, mobileMenu);
    });
    
    //4.
    //aparte locatie selecteren
    var idLoc;
    var pos;
    var locationList = $('#locations_list');
    var locationHead = $('.locations_header');    

    function locInfo(jsonObject, pos,id){
        var loc = jsonObject[pos];
        var locNaam = getTranslation('location_name', language, pos);
        var locAdres = getTranslation('location_address', language, pos);
        var locDescr = getTranslation('location_description', language, pos);
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
                    "<h3>"+getTranslation('artwork_name', language, pos, a)+"</h3>"+
                    "<p>"+artwork.artist['name']+"</p>"+
                 "</a>"+
                 "</li>";
        });    
        $('.art_lists').html("<ul>"+art+"</ul>");
        $('.loc_number').html("[<span>" + id + "</span>]");
    }

    //slide in view animation function
    //$('.location').hide();  
    function locAnimate(){
       $('.location').addClass('slideLeftAni');
       $('.location').removeClass('slideRightAni');  
       $('.location').removeClass('slideRight');    
       $('.location').show();
       $('.datacontainer').css('zIndex', '20');
       setTimeout( function(){
            $('.location').removeClass('slideLeftAni');
            $('.location').addClass('slideLeft');
        },1000);       
    } 

    //slide back out of view on click
    $('.location_header').on('click', function(){
            $('.location').addClass('slideRightAni');
            $('.location').removeClass('slideLeftAni');
            $('.location').removeClass('slideLeft');
            //$('.location').hide();
            setTimeout( function(){
                $('.datacontainer').css('zIndex', '-20');
                $('.location').removeClass('slideRightAni');
                $('.location').addClass('slideRight');
            },1000);

    }); 
    
    
    
    if(typeof(Storage) !== "undefined") {
        if (localStorage.getItem('contour_data')) {
            jsonObject = JSON.parse(localStorage.getItem('contour_data'));
            handleLocations(jsonObject);
            $.each(jsonObject, function(i, item) {
                 locationCoords.push({id: item.id, lat: item.lat, long: item.long});    
            });
            //4.navigation to location detail start
            $('.locations_item').on('click', function(){
                idLoc = $(this).attr('id');
                console.log(idLoc);
                pos = idLoc - 1; 
                locInfo(jsonObject, pos,idLoc); 
                menuAnimate(locationHead,mobileMenu);
                locAnimate();
            });
        } else {
            window.location="index.html";
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
        
        $(".mapcontainer").trigger('update', [updatedOptions, newPlots, deletedPlots, {animDuration : 0}]);
        
        if (!executed) {
            executed = true;
            $(".mapcontainer").trigger('zoom', {level : 10, latitude : currentLatitude, longitude : currentLongitude});
        }
	}
    
    function showPosition(position) {
            var currentLat = position.coords.latitude;
            var currentLong = position.coords.longitude;
            if($('.mapcontainer')) {
                updatePosition(currentLat, currentLong);
            }
            $.each(locationCoords, function(i, item) {
                calcDistance(currentLat, currentLong, item);
            });
    }
    
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                showPosition,
                function(error){
                     console.log(error);
                });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }
    
    //Ajax calls to insert user data
    function getDateTime() {
        var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        return datetime;
    }
    function insertData(location) {
        if(localStorage.getItem('contour_currentLocation')) {
            console.log('Current location not finished yet.');
        } else {
            $.ajax({
                type: "POST",
                url: "ajax/insertdata.php",
                data: {person_id: localStorage.getItem('contour_uid'), location_id: location.id, start_time: getDateTime()},
                dataType: "json"
            })
            .done(function( data ){
                if(data) {
                    localStorage.setItem('contour_currentLocation', JSON.stringify({record_id: data, location_id: location.id}));
                }
            });
        }
    }
    function updateData(currentLocation) {
        $.ajax({
            type: "POST",
            url: "ajax/updatedata.php",
            data: {person_id: localStorage.getItem('contour_uid'), record_id: currentLocation.record_id, location_id: currentLocation.location_id, end_time: getDateTime()},
            dataType: "json"
        })
        .done(function( data ){
            localStorage.removeItem('contour_currentLocation');
        });
    }
    
    //Calculate distance
    function toRad(Value) {
        return Value * Math.PI / 180;
    }
    function calcDistance(lat, lng, location) {
        var R = 6371000; // Radius of earth in km
        var dLat = toRad(location.lat-lat);
        var dLon = toRad(location.long-lng); 
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat)) * Math.cos(toRad(location.lat)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        console.log(d);
        if(d < 30) {
            insertData(location);
        } else {
            if (localStorage.getItem('contour_currentLocation')) {
                var currentLocation = localStorage.getItem('contour_currentLocation');
                currentLocation = JSON.parse(currentLocation);
                updateData(currentLocation);
            }
        }
    }
    
    //Initial functions to be loaded
    getLocation();
});