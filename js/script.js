$(document).ready(function(){
    console.log('Version 0.2');
    $(".mapcontainer").mapael({
        map : {
            name : "mechelen",
            zoom : { enabled : true, maxLevel : 10, mousewheel : false, init : { level : 2, latitude : 51.0288, longitude: 4.479} },
        },
        areas: {
            "groen" : { attrs : { fill : "#129764" } },
            "water" : { attrs : { fill : "#6283c2" } },
            "straat" : { attrs : { fill : "#fff" } },
            "straatnaam" : { attrs : { fill : "#666666" } },
            "parkwaternaam" : { attrs : { fill : "#fff" } }
        },
        plots: {

        }
    });
    
    
    var updatedOptions = {areas: {}, plots: {}};
    var deletedPlots = [];
    var newPlots = {};
    $.ajax({
     type: "GET",
     url: "http://preview-app.contour7.be/gateway/programme/complete",
     async: false,
     beforeSend: function(x) {
      if(x && x.overrideMimeType) {
       x.overrideMimeType("application/j-son;charset=UTF-8");
      }
     },
     dataType: "json",
     success: function(contour){
        console.log(contour);
         
        $.each(contour, function(i, item)
        {
            var artworks = "";
            $.each(item.artworks, function(a, artwork)
            {
                artworks += "<li>"+artwork.name_nl+"</li>";
            });
            //console.log(item);
            
            newPlots[item.code] = {
                type: "circle",
                size: 20,
                latitude: item.lat,
                longitude: item.long,
                attrs: { fill: "#2056a4" },
                text: {
                    content: item.id,
                    position: "inner",
                    attrs: {
                        "font-size": 14,
                        "font-weight" : "bold",
                        fill: "#fff"
                    }
                },
                eventHandlers: {
                    'click touchstart': function (e, id, mapElem, textElem, elemOptions) {
                        $('#clickContent').html(
                            "<div id='testcontent'>"+
                                "<h2><a href='/location/"+item.id+"'>"+item.code+"</a></h2>"+
                                "<a href='#' class='closeBtn'></a>"+
                                "<ul>"+artworks+"</ul>"+
                            "</div>"
                        );
                    }
                }
            };
        }); 
     }
    });
    
    $(".mapcontainer").trigger('update', [updatedOptions, newPlots, deletedPlots, {animDuration : 1000}]);
    
    
    function updatePosition(currentLatitude, currentLongitude) {
        var updatedOptions = {areas: {}, plots: {}};
        var deletedPlots = ["user"];
		var newPlots = {
            "user": {
                type: "circle", size: 10, latitude : currentLatitude, longitude : currentLongitude, attrs: { fill : "red" }, text : {content: ""}
            }
		};
        
        $(".mapcontainer").trigger('update', [updatedOptions, newPlots, deletedPlots, {animDuration : 1000}]);
	}
    
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
    
    function showPosition(position) {
        var currentLat = position.coords.latitude;
        var currentLong = position.coords.longitude;
        updatePosition(currentLat, currentLong);
        calcDistance(currentLat, 51.0288, currentLong, 4.479);
    }
    
    function toRad(Value) {
        /** Converts numeric degrees to radians */
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
    
    var streetnames = $("[data-id='straatnaam']");
    $('#toggle').click( function() {
        if(streetnames.css('display') == "none") {
            streetnames.show();
        } else {
            streetnames.hide();
        }
    });
    
    //Initial functions to be loaded
    streetnames.hide();
    getLocation();
    setInterval(getLocation, 5000);
});