(function(){
'use strict';

angular.module('factories', [])
// INFO FACTORY
// TODO replace with actual backend API requests
.factory('PublicInfoFactory',function($http){

    return {
        fire: getJson.bind(null, 'https://data.nashville.gov/api/views/frq9-a5iv/rows.json'),
        parks: getJson.bind(null, 'https://data.nashville.gov/api/views/74d7-b74t/rows.json'),
        hotspots: getJson.bind(null, 'https://data.nashville.gov/api/views/4ugp-s85t/rows.json'),
        community : getJson.bind(null, 'datasets/community-centers-cleaned.json'),
        police: getJson.bind(null, 'https://data.nashville.gov/api/views/y5ik-ut5s/rows.json')
    };


    function getJson(url) {
        return $http.get(url);
    }
})
// MAP FACTORY
.factory('MapFactory', function(){
    return{
        initMap: initMap,
        PlacePoints: PlacePoints
    };

    function PlacePoints(points, map) {
        var res = [];
        points.forEach(function(el){
            var curMarker = L.marker.apply(null, el);
            res.push(curMarker);
            curMarker.addTo(map);
        });
        return res;
    }
    
    function initMap(){
        var map = L.map('map').setView([36.165818, -86.784245], 13);
        L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
            subdomains: ['otile1','otile2','otile3','otile4']
        }).addTo( map );
        return map;
    }
});
})();

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

(function () {

'use strict';

angular.module('nashviva', ['ngRoute','home'])
.config(function($routeProvider){
    $routeProvider.otherwise({redirectTo: '/'});
});

})();
