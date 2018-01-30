var logger = require('loglevel');
var _ = require('./lodash');
var helpers = require('./helpers');
var PathElevation = require('./PathElevation');
var Stations = require('./Stations');

module.exports = function (geoJson) {
    // Constants
    var EXPECTED_NUMBER_OF_PATHS = 1;
    var EXPECTED_NUMBER_OF_STATIONS = 14;
    var MAXIMUM_DISTANCE_FROM_STATION_TO_PATH = 100; // meters

    // Methods
    this.isVerifiable = function() {
        return this.isRouteVerifiable;
    }

    this.isSinglePath = function() {
        var result = _.isEqual(this.numberOfPaths, EXPECTED_NUMBER_OF_PATHS);
        logger.debug('isSinglePath:', result, ', numberOfPaths:', this.numberOfPaths);
        return result;
    }

    this.areAllStationsPresent = function() {
        var numberOfStations = this.stations.getCount();
        var result = _.isEqual(numberOfStations, EXPECTED_NUMBER_OF_STATIONS);
        logger.debug('areAllStationsPresent:', result,', numberOfStations:', numberOfStations);
        return result;
    }

    this.areStationsOnThePath = function() {
        var result = this.stations.areAllOnThePath(MAXIMUM_DISTANCE_FROM_STATION_TO_PATH);
        logger.debug('areStationsOnThePath:', result);
        return result;
    }

    this.isStationOrderCorrect = function() {
        var result = this.stations.isOrderCorrect();
        logger.debug('isStationOrderCorrect:', result);
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
                throw new Error(error);
            });
    }

    this.getPathElevation = function() {
        logger.debug('getPathElevation:', this.pathElevation);
        return this.pathElevation;
    }

    // Constructor
    var lineString = helpers.getLineString(geoJson);
    var points = helpers.getPoints(geoJson);

    this.isRouteVerifiable = true;
    if(_.isEmpty(lineString)) {
        logger.error('No line string in route.')
        this.isRouteVerifiable = false;
    }
    if(_.isEmpty(points)) {
        logger.error('No points in route.')
        this.isRouteVerifiable = false;
    }
    if(!this.isRouteVerifiable) {
        return;
    }

    this.numberOfPaths = helpers.getNumberOfFeatures('LineString', geoJson);
    this.stations = new Stations(points, lineString);
    this.path = this.stations.isPathReversed() ? helpers.reverseLineString(lineString) : lineString;
}
