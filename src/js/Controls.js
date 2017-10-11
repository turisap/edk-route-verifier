module.exports = function (geoJson) {
    // Constructor

    // Constants
    var SINGLE_PATH_ID = 'div#singlePath';
    var NUMBER_OF_STATIONS_ID = 'div#numberOfStations';
    var STATIONS_ORDER_AND_NAMING_ID = 'div#updateStationsOrderAndNaming';
    var STATIONS_START_END_MARKED_ID = 'div#updateStationsStartEndMarked';
    var VALID_COLOR_CLASS = 'bg-green';
    var INVALID_COLOR_CLASS = 'bg-red';

    var updateControl = function(element, isValid) {
        isValid ? $(element).addClass(VALID_COLOR_CLASS) : $(element).addClass(INVALID_COLOR_CLASS);
    }

    // Methods
    this.updatePathType = function(isNormalPath) {

    }
    this.updatePathLength = function(length) {

    }
    this.updateElevationGain = function(elevationGain) {

    }
    this.updateElevationLoss = function(elevationLoss) {

    }
    this.updateElevationTotalChange = function(elevationTotalChange) {

    }
    this.updateNumberOfStations = function(areAllStationsPresent) {
        updateControl(NUMBER_OF_STATIONS_ID, areAllStationsPresent);
    }
    this.updateStationsOrderAndNaming = function(isStationOrderCorrect, isStationNamingCorrect) {
        updateControl(STATIONS_ORDER_AND_NAMING_ID, isStationOrderCorrect && isStationNamingCorrect);
    }
    this.updatePathStartEndMarked = function(isPathStartMarked, isPathEndMarked) {
        updateControl(STATIONS_START_END_MARKED_ID, isPathStartMarked && isPathEndMarked);
    }
    this.updateSinglePath = function(isSinglePath) {
        updateControl(SINGLE_PATH_ID, isSinglePath);
    }
}
