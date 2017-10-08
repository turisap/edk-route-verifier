var toGeoJSON = require('togeojson');
var _ = require('lodash');

function getGeoJSON(xml) {
    return toGeoJSON.kml(xml);
}

function getLineString(geoJson) {
    var lineString = _.find(geoJson.features, function (feature) {
        return _.isEqual(feature.geometry.type, 'LineString')
    });
    return lineString;
}

function getGoogleMapsPath(lineString) {
    var path = _.map(lineString.geometry.coordinates, function (element) {
        return new google.maps.LatLng(element[0], element[1]);
    });
    return path;
}

function getPathElevations(geoJson) {
    var lineString = getLineString(geoJson);

    if (lineString.geometry.coordinates[0].length === 3) {
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
}

module.exports = {
    getGeoJSON: getGeoJSON,
    getLineString: getLineString,
    getGoogleMapsPath: getGoogleMapsPath,
    getPathElevations: getPathElevations
}