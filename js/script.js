$(document).ready(function(){
    console.log('Version 0.5.2');
    
    //Variables
    var executed = false;
    var locationCoords = [];
    
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
                        window.location = "locatie.html?id="+item.id;
                    }
                }
            };
            
            //2. Locations Menu
            //Get all locations
            locations += "<li class='locations_item'><a class='loclink' href='locatie.html?id="+item.id+"'><p class='location_number'>[<span>" + item.id + "</span>]</p><h3>"+item.name_nl+"</h3></a></li>";
            $('#locations_list').html(
                "<ul>"+locations+"</ul>"
            );
        });
        $(".mapcontainer").trigger('update', [updatedOptions, newPlots, deletedPlots, {animDuration : 1000}]);
    }
    
    //3.
    //menu animatie
    var locationList = $('#locations_list');
    var locationHead = $('.locations_header');
    locationList.hide();
    locationHead.on('click', function(){
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
    
    if(typeof(Storage) !== "undefined") {
        if (localStorage.getItem('contour_data')) {
            var jsonObject = JSON.parse(localStorage.getItem('contour_data'));
            handleLocations(jsonObject);
            $.each(jsonObject, function(i, item) {
                 locationCoords.push({id: item.id, lat: item.lat, long: item.long});
            });
        } else {
            window.location="/";
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
            alert("Geolocation is not supported by this browser.");
        }
    }
    
    function getDateTime() {
        var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        return datetime;
    }
    function savePersonData(location) {
        $.ajax({
            type: "POST",
            url: "ajax/addperson.php",
            data: {person_id: localStorage.getItem('contour_uid'), location_id: location.id, start_time: getDateTime()},
            dataType: "json"
        })
        .done(function( data ){
            if(data) {
                localStorage.setItem('contour_currentLocation', JSON.stringify({record_id: data, location_id: location.id}));
            }
        });
    }
    function updateData(currentLocation) {
        $.ajax({
            type: "POST",
            url: "ajax/updateperson.php",
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
            savePersonData(location);
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