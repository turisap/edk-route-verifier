var logger = require('loglevel');
var toGeoJSON = require('togeojson');
var _ = require('./lodash');

function getGeoJSON(xml) {
    var geoJson = toGeoJSON.kml(xml);

    logger.log('GeoJSON: ', geoJson);
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

function reverseLineString(lineString) {
    var newLineString = Object.assign({}, lineString);
    newLineString.geometry.coordinates = lineString.geometry.coordinates.reverse();
    return newLineString;
}

function getPoints(geoJson) {
    var points = _.filter(geoJson.features, function (feature) {
        return _.isEqual(feature.geometry.type, 'Point')
    });
    return points;
}

function getRoute(routeUrl, isLocal) {
    routeUrl = isLocal
        ? 'http://localhost:8080' + routeUrl.replace(/^.*\/\/[^\/]+/, '')
        : routeUrl;
    logger.debug('Fetching route from:', routeUrl);
    return $.ajax(routeUrl);
}

function getGoogleMapsPath(lineString) {
    var path = _.map(lineString.geometry.coordinates, function (element) {
        return new google.maps.LatLng(element[1], element[0]);
    });
    return path;
}

function getPathElevations(lineString, useLocalElevations) {
    if (useLocalElevations && lineString.geometry.coordinates[0].length === 3) {
        // Elevation present in line string

        logger.debug('Getting path elevations from line string...');
        var elevations = _.map(lineString.geometry.coordinates, function (element) {
            return {elevation: element[2]};
        });

        logger.debug('Elevations:', elevations);
        return new Promise(function(resolve,reject) {
            resolve(elevations);
        })
    } else {
        // No elevation in line string
        var path = getGoogleMapsPath(lineString);

        // Optimize path array length
        var MAXIMUM_NUMBER_OF_SAMPLES = 512;
        var ratio = Math.ceil(path.length / MAXIMUM_NUMBER_OF_SAMPLES);
        path = path.filter(function(value, index) {
            return (index % ratio == 0);
        });

        return new Promise(function(resolve,reject) {
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

function getRouteParameters(routeParamsUrl) {
    return new Promise(function(resolve,reject) {
        $.ajax(routeParamsUrl)
            .done(function (data) {
                logger.debug('Route parameters:', data);
                if (data.success === 1) {
                    resolve(data);
                } else {
                    reject('Server side error: ' + data.error);
                }
            })
            .fail(function (xhr, status) {
                reject(status);
            })
    });
}

module.exports = {
    getGeoJSON: getGeoJSON,
    getNumberOfFeatures: getNumberOfFeatures,
    getLineString: getLineString,
    reverseLineString: reverseLineString,
    getPoints: getPoints,
    getRoute: getRoute,
    getGoogleMapsPath: getGoogleMapsPath,
    getPathElevations: getPathElevations,
    getRouteParameters: getRouteParameters
}