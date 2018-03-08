import logger from 'loglevel';
import * as _ from './lodash';
import helpers from './helpers';
import PathElevation from './PathElevation';
var Stations = require('./Stations');

// Constants
const EXPECTED_NUMBER_OF_PATHS = 1;
const EXPECTED_NUMBER_OF_STATIONS = 14;
const MAXIMUM_DISTANCE_FROM_STATION_TO_PATH = 100; // meters


export default class Route {

    constructor (geoJson) {
        this.geoJson = geoJson;
        this.lineString = helpers.getLineString(this.geoJson);
        this.points = helpers.getPoints(this.geoJson);
    }

    isRouteVerifiable = true;
    numberOfPaths = helpers.getNumberOfFeatures('LineString', this.geoJson);
    stations = new Stations(points, lineString);
    path = this.stations.isPathReversed() ? helpers.reverseLineString(lineString) : lineString;

    static isVerifiable () {
        return this.isRouteVerifiable;
    }

    static isSinglePath () {
        var result = _.isEqual(this.numberOfPaths, EXPECTED_NUMBER_OF_PATHS);
        logger.debug('isSinglePath:', result, ', numberOfPaths:', this.numberOfPaths);
        return result;
    }

    static areAllStationsPresent () {
        var numberOfStations = this.stations.getCount();
        var result = _.isEqual(numberOfStations, EXPECTED_NUMBER_OF_STATIONS);
        logger.debug('areAllStationsPresent:', result,', numberOfStations:', numberOfStations);
        return result;
    }

    static areStationsOnThePath () {
        var result = this.stations.areAllOnThePath(MAXIMUM_DISTANCE_FROM_STATION_TO_PATH);
        logger.debug('areStationsOnThePath:', result);
        return result;
    }

    static isStationOrderCorrect = function() {
        var result = this.stations.isOrderCorrect();
        logger.debug('isStationOrderCorrect:', result);
        return result;
    }

    static getPathLength () {
        var result = 0;

        var googleMapsPath = helpers.getGoogleMapsPath(this.path);
        result = google.maps.geometry.spherical.computeLength(googleMapsPath);
        result = result / 1000;

        logger.debug('getPathLength [km]:', result);
        return result;
    }

    static fetchPathElevationData () {
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

    static getPathElevation () {
        logger.debug('getPathElevation:', this.pathElevation);
        return this.pathElevation;
    }
}



module.exports = function (geoJson) {


    // Constructor



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

}
