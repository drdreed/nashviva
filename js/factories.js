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
