(function(){
    angular.module('home', ['ngRoute', 'factories'])

.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl: 'partials/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
    });
})
.controller('HomeController', function(PublicInfoFactory, MapFactory){
    //Initialize the Leaflet.js map. 
    var map = MapFactory,
        info = PublicInfoFactory,
        vm = this;

    var leaf = map.initMap();

    vm.toggle = function(type){
        if(vm[type]){
            vm[type].forEach(function(point){
              var op = point.options.opacity > 0 ? 0 : 1;
              point.setOpacity(op);
            });
        }
        else{
            info[type]()
            .success(function (data) {
                    var markPoints;
                    if (data.hasOwnProperty("data")) {
                        switch (type) {
                            case "fire":
                                markPoints = processJSON(data, 13, 9);
                                break;
                            case "police":
                                markPoints = processJSON(data, 16, 8);
                                break;
                            case "parks":
                                markPoints = processJSON(data, 41, 8);
                                break;
                            case "hotspots":
                                markPoints = processJSON(data, 11, 8);
                                break;
                        }
                        markPoints = markPoints.filter(function (n) {
                            return n != undefined
                        });
                    } else {
                        markPoints = data.map(function (el) {
                            return [el.location.reverse(), {title: el.address}];
                        });
                    }
                    vm[type] = map.PlacePoints(markPoints, leaf);
            })
            .error(function (data) {
                    console.error("error" + data);
            });
        }
    };
    vm.toggle('fire');
});

})();


function processJSON(data, locationKey, titleKey) {
    return data.data.map(function (el) {
        var lat = el[locationKey][1];
        var long = el[locationKey][2];
        var location = ["", ""];
        if (lat !== null && long !== null) {
            location = [el[locationKey][1], el[locationKey][2]];
            return [location, {title: el[titleKey]}];
        }
    });
}
