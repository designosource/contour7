$(document).ready(function(){
    console.log('Version 0.4');
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
    
    //Handle JSON object
    function addLocations(jsonObject) {
        var updatedOptions = {areas: {}, plots: {}};
        var deletedPlots = [];
		var newPlots = {};
        $.each(jsonObject, function(i, item) {
            newPlots[item.code] = {
                type: "circle", size: 15, latitude: item.lat, longitude: item.long, attrs: { fill: "#2056a4" }, text : {content: item.id, position : "inner", attrs : { "font-size" : 12 , "font-weight" : "bold" , fill : "#fff" } }
            };
        });
        
        $(".mapcontainer").trigger('update', [updatedOptions, newPlots, deletedPlots, {animDuration : 1000}]);
    }
    
    if(typeof(Storage) !== "undefined") {
        if (localStorage.getItem('jsondata') === null) {
            window.location="/";
        } else {
            var jsonObject = JSON.parse(localStorage.getItem('jsondata'));
            addLocations(jsonObject);
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
                type: "image", url: "http://www.neveldo.fr/mapael/marker.png", width: 12, height: 40, latitude : currentLatitude, longitude : currentLongitude, attrs: { fill : "red" }, text : {content: ""}
            }
		};
        
        $(".mapcontainer").trigger('update', [updatedOptions, newPlots, deletedPlots, {animDuration : 1000}]);
	}
    
    function showPosition(position) {
        var currentLat = position.coords.latitude;
        var currentLong = position.coords.longitude;
        updatePosition(currentLat, currentLong);
        calcDistance(currentLat, 51.0288, currentLong, 4.479);
    }
    
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
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
    
    /*var test = $("[data-id='test']");
    test.click( function() {
        alert('test');
    });*/
    
    //Initial functions to be loaded
    getLocation();
    setInterval(getLocation, 5000);
});