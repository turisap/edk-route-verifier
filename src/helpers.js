var logger = require('loglevel');
var toGeoJSON = require('togeojson');
var flatten = require('@turf/flatten');
var _ = require('./lodash');

function getGeoJSON(kml) {
    var extendedData = kml.getElementsByTagName("ExtendedData");
    for (var index = extendedData.length - 1; index >= 0; index--) {
        extendedData[index].parentNode.removeChild(extendedData[index]);
    }
    logger.log('KML (no ExtendedData):', kml);
        
    var geoJson = toGeoJSON.kml(kml);
    geoJson = flatten(geoJson);
    logger.log('GeoJSON (flatten): ', geoJson);
    
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

function getRoute(routeUrl) {
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
        // This is done to send no more than MAXIMUM_NUMBER_OF_LATLNG_OBJECTS coordinates in KML path
        var MAXIMUM_NUMBER_OF_SAMPLES = 512;
        var MAXIMUM_NUMBER_OF_LATLNG_OBJECTS = 2048;
        logger.debug('Number of LatLng objects:', path.length);
        if (path.length > MAXIMUM_NUMBER_OF_LATLNG_OBJECTS) {
            var optimizedPath = [];
            var delta = parseFloat(path.length / MAXIMUM_NUMBER_OF_LATLNG_OBJECTS);
            for (var i = 0; i < path.length; i = i + delta) {
                optimizedPath.push(path[Math.floor(i)]);
            }
            path = optimizedPath;
            logger.debug('Number of LatLng objects after optimization:', path.length);
        }

        return new Promise(function(resolve,reject) {
            var elevator = new google.maps.ElevationService;
            elevator.getElevationAlongPath({
                'path': path,
                'samples': MAXIMUM_NUMBER_OF_SAMPLES
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

function approveRoute(routeApproveUrl) {
    return new Promise(function(resolve,reject) {
        $.ajax(routeApproveUrl)
            .done(function (data) {
                resolve({success: true});
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
    getRouteParameters: getRouteParameters,
    approveRoute: approveRoute
}