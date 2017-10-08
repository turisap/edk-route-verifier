var lineDistance = require('@turf/line-distance');
var converters = require('./converters');

module.exports.getPathLength = function(geoJson, useTurf) {
    if (useTurf) {
        return lineDistance(geoJson);
    } else {
        var lineString = converters.getLineString(geoJson);
        var googleMapsPath = converters.getGoogleMapsPath(lineString);
        return google.maps.geometry.spherical.computeLength(googleMapsPath);
    }
}

module.exports.getElevationGain = function(elevations) {
    var elevationGain = 0.0;
    for(var i = 1; i < elevations.length; i++) {
        var elevationDifference = elevations[i].elevation - elevations[i-1].elevation;
        elevationGain += (elevationDifference > 0) ? elevationDifference : 0.0;
    }
    return Number(elevationGain);
}

module.exports.getElevationLoss = function(elevations) {
    var elevationLoss = 0.0;
    for(var i = 1; i < elevations.length; i++) {
        var elevationDifference = elevations[i-1].elevation - elevations[i].elevation;
        elevationLoss += (elevationDifference > 0) ? elevationDifference : 0.0;
    }
    return Number(elevationLoss);
}

module.exports.getTotalElevationChange = function(elevationGain, elevationLoss) {
    return Number(elevationGain + elevationLoss);
}