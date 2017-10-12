var _ = require('lodash');
var toGeoJSON = require('togeojson');

function getRouteUrl(routeId, isLocal) {
    var serverUrl = isLocal ? 'http://localhost:3000/' : 'http://rejony.edk.org.pl/';
    var path = 'api/edk/route-files/' + routeId + '/download/gps';
    return serverUrl + path;
}

function getGeoJSON(xml) {
    var geoJson = toGeoJSON.kml(xml);

    console.log('GeoJSON: ', geoJson);
    return geoJson;
}

function getNumberOfFeatures(featureName, geoJson) {
    var features = _.filter(geoJson.features, function (feature) {
        return _.isEqual(feature.geometry.type, featureName)
    });
    return features.length;
}

function getLineString(geoJson) {
    var lineString = _.find(geoJson.features, function (feature) {
        return _.isEqual(feature.geometry.type, 'LineString')
    });
    return lineString;
}

function getPoints(geoJson) {
    var points = _.filter(geoJson.features, function (feature) {
        return _.isEqual(feature.geometry.type, 'Point')
    });
    return points;
}

function getRoute(routeId, isLocal) {
    return $.ajax(getRouteUrl(routeId, isLocal));
}

function getGoogleMapsPath(lineString) {
    var path = _.map(lineString.geometry.coordinates, function (element) {
        return new google.maps.LatLng(element[0], element[1]);
    });
    return path;
}

function getPathElevations(lineString, useLocalElevations) {
    if (useLocalElevations && lineString.geometry.coordinates[0].length === 3) {
        // Elevation present in line string
        var elevations = _.map(lineString.geometry.coordinates, function (element) {
            return {elevation: element[2]};
        });

        return new Promise(function(resolve,reject) {
            resolve(elevations);
        })
    } else {
        // No elevation in line string
        var path = getGoogleMapsPath(lineString);

        return new Promise(function(resolve,reject) {
            var MAXIMUM_NUMBER_OF_SAMPLES = 512;
            var elevator = new google.maps.ElevationService;
            elevator.getElevationAlongPath({
                'path': path,
                'samples': _.min([path.length, MAXIMUM_NUMBER_OF_SAMPLES])
            }, function(elevations, status) {
                if (status === google.maps.ElevationStatus.OK) {
                    resolve(elevations);
                } else {
                    reject(status);
                }
            });
        });
    }
}

module.exports = {
    getGeoJSON: getGeoJSON,
    getNumberOfFeatures: getNumberOfFeatures,
    getLineString: getLineString,
    getPoints: getPoints,
    getRoute: getRoute,
    getGoogleMapsPath: getGoogleMapsPath,
    getPathElevations: getPathElevations
}