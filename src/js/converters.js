var toGeoJSON = require('togeojson');
var _ = require('lodash');

module.exports.getGeoJSON = function(xml) {
    return toGeoJSON.kml(xml);
}

module.exports.getPathElevations = function(geoJson) {
    var lineString = _.find(geoJson.features, function (feature) {
        return _.isEqual(feature.geometry.type, 'LineString')
    });
    var path = _.map(lineString.geometry.coordinates, function (element) {
        return {lat: element[0], lng: element[1]};
    });

    return new Promise(function(resolve,reject) {
        var elevator = new google.maps.ElevationService;
        var maximumNumberOfSamples = 512;
        elevator.getElevationAlongPath({
            'path': path,
            'samples': _.min([path.length, maximumNumberOfSamples])
        }, function(elevations, status) {
            if (status == google.maps.ElevationStatus.OK) {
                resolve(elevations);
            } else {
                reject(status);
            }
        });
    });
}