var logger = require('loglevel');
var _ = require('./lodash');
var pointOnLine = require('@turf/point-on-line');
var helpers = require('./helpers');
var PathElevation = require('./PathElevation');

function _sortPoints(points, lineString) {
    var enhancedPoints = _.map(points, function (point) {
        point.properties.nearestOnLine = pointOnLine(lineString, point, 'meters');
        return point;
    });

    var sortedPoints = _.sortBy(enhancedPoints, function (point) {
        return point.properties.nearestOnLine.properties.location;
    })

    return sortedPoints;
}

module.exports = function (geoJson) {
    // Constructor
    var lineString = helpers.getLineString(geoJson);
    var points = helpers.getPoints(geoJson);

    this.numberOfPaths = helpers.getNumberOfFeatures('LineString', geoJson);
    this.path = lineString;
    this.numberOfStations = helpers.getNumberOfFeatures('Point', geoJson);
    this.stations = _sortPoints(points, lineString);

    // Constants
    var EXPECTED_NUMBER_OF_PATHS = 1;
    var EXPECTED_NUMBER_OF_STATIONS = 14;
    var MAXIMUM_DISTANCE_FROM_STATION_TO_PATH = 100; // meters
    var MAXIMUM_DISTANCE_FROM_START_END_TO_PATH = 5; // meters
    var STATIONS_NAMING_REGEX = /^(Stacja )?(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV)$/g;
    var getStationRegex = function(stationIdRoman) {
        return new RegExp('^(Stacja )?' + stationIdRoman + '$');
    }
    var STATION_NAME_REGEX = [
        getStationRegex('I'),
        getStationRegex('II'),
        getStationRegex('III'),
        getStationRegex('IV'),
        getStationRegex('V'),
        getStationRegex('VI'),
        getStationRegex('VII'),
        getStationRegex('VIII'),
        getStationRegex('IX'),
        getStationRegex('X'),
        getStationRegex('XI'),
        getStationRegex('XII'),
        getStationRegex('XIII'),
        getStationRegex('XIV')
    ];

    // Methods
    this.isSinglePath = function() {
        var result = _.isEqual(this.numberOfPaths, EXPECTED_NUMBER_OF_PATHS);
        logger.debug('isSinglePath:', result, ', numberOfPaths:', this.numberOfPaths);
        return result;
    }

    this.areAllStationsPresent = function() {
        var result = _.isEqual(this.numberOfStations, EXPECTED_NUMBER_OF_STATIONS);
        logger.debug('areAllStationsPresent:', result,', numberOfStations:', this.numberOfStations);
        return result;
    }

    this.areStationsOnThePath = function() {
        var invalidStations = [];

        _.forEach(this.stations, function (station) {
            var stationName = station.properties.name;
            var distanceFromStationToPath = station.properties.nearestOnLine.properties.dist;
            if (distanceFromStationToPath > MAXIMUM_DISTANCE_FROM_STATION_TO_PATH) {
                invalidStations.push(stationName);
            }
        })

        var result = _.isEmpty(invalidStations);
        logger.debug('areStationsOnThePath:',result,', invalidStations:', invalidStations);
        return result;
    }

    this.isStationNamingCorrect = function() {
        var invalidStations = [];

        _.forEach(this.stations, function (station) {
            var stationName = station.properties.name;
            var matches = stationName.match(STATIONS_NAMING_REGEX);
            if (_.isNull(matches)) {
                invalidStations.push(stationName);
            }
        });

        var result = _.isEmpty(invalidStations);
        logger.debug('isStationNamingCorrect:',result,', invalidStations:', invalidStations);
        return result;
    }

    this.isStationOrderCorrect = function() {
        var invalidStations = [];

        for(var i = 0; i < this.stations.length; i++) {
            var station = this.stations[i];
            var stationName = station.properties.name;
            var matches = stationName.match(STATION_NAME_REGEX[i]);
            if (_.isNull(matches)) {
                invalidStations.push(stationName);
            }
        }

        var result = _.isEmpty(invalidStations);
        logger.debug('isStationOrderCorrect:',result,', invalidStations:', invalidStations);
        return result;
    }

    this.isPathStartMarked = function() {
        var result = true;

        var firstStation = this.stations[0];
        var distanceFromStationToPath = firstStation.properties.nearestOnLine.properties.dist;
        if (distanceFromStationToPath > MAXIMUM_DISTANCE_FROM_START_END_TO_PATH) {
            result = false;
        }

        logger.debug('isPathStartMarked:', result);
        return result;
    }

    this.isPathEndMarked = function() {
        var result = true;

        var lastStation = this.stations[this.numberOfStations - 1];
        var distanceFromStationToPath = lastStation.properties.nearestOnLine.properties.dist;
        if (distanceFromStationToPath > MAXIMUM_DISTANCE_FROM_START_END_TO_PATH) {
            result = false;
        }

        logger.debug('isPathEndMarked:', result);
        return result;
    }


    this.getPathLength = function() {
        var result = 0;

        var googleMapsPath = helpers.getGoogleMapsPath(this.path);
        result = google.maps.geometry.spherical.computeLength(googleMapsPath);
        result = result / 1000;

        logger.debug('getPathLength [km]:', result);
        return result;
    }

    this.fetchPathElevationData = function() {
        var _this = this;
        return helpers.getPathElevations(this.path)
            .then(function(elevations) {
                logger.debug('Path elevations:', elevations);
                _this.pathElevation = new PathElevation(elevations);
                return _this.pathElevation;
            })
            .catch(function(error) {
                logger.error('Path elevation data fetching error. Error:', error);
            });
    }

    this.getPathElevation = function() {
        logger.debug('getPathElevation:', this.pathElevation);
        return this.pathElevation;
    }
}
