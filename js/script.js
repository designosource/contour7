$(document).ready(function(){
    console.log('Version 0.2');
    $(".mapcontainer").mapael({
        map : {
            name : "mechelen",
            zoom : { enabled : true, maxLevel : 10, mousewheel : false, init : { level : 2, latitude : 51.0288, longitude: 4.479} },
        },
        areas: {
            "groen" : { attrs : { fill : "#009344" } },
            "water" : { attrs : { fill : "#1B75BB" } },
            "straat" : { attrs : { fill : "#fff" } },
            "straatnaam" : { attrs : { fill : "black" } }
        },
        plots: {

        }
    });
    
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