module.exports = function (geoJson) {
    // Constructor

    // Constants
    var ROUTE_TYPE_ID = 'div#routeType';
    var SINGLE_PATH_ID = 'div#singlePath';
    var PATH_LENGTH_ID = 'div#pathLength';
    var ELEVATION_GAIN_ID = 'div#elevationGain';
    var ELEVATION_LOSS_ID = 'div#elevationLoss';
    var ELEVATION_TOTAL_CHANGE_ID = 'div#elevationTotalChange';
    var NUMBER_OF_STATIONS_ID = 'div#numberOfStations';
    var STATIONS_ORDER_AND_NAMING_ID = 'div#updateStationsOrderAndNaming';
    var STATIONS_START_END_MARKED_ID = 'div#updateStationsStartEndMarked';

    var updateControlColor = function(element, isValid) {
        var VALID_COLOR_CLASS = 'bg-green';
        var INVALID_COLOR_CLASS = 'bg-yellow';
        var INFO_BOX_ICON = 'span.info-box-icon';

        isValid
            ? $(element + ' ' + INFO_BOX_ICON).removeClass(INVALID_COLOR_CLASS).addClass(VALID_COLOR_CLASS)
            : $(element + ' ' + INFO_BOX_ICON).removeClass(VALID_COLOR_CLASS).addClass(INVALID_COLOR_CLASS);
    }

    var updateControlValue = function(element, value, unit) {
        var INFO_BOX_NUMBER = 'span.info-box-number';

        $(element + ' ' + INFO_BOX_NUMBER).html(value + ' ' + (unit ? '<small>'+unit+'</small>' : ''));
    }

    // Methods
    this.updateRouteType = function(isNormalRoute) {
        updateControlValue(ROUTE_TYPE_ID, isNormalRoute ? 'Normalna' : 'Na wzór');
    }

    this.updatePathLength = function(isLengthValid, length) {
        updateControlValue(PATH_LENGTH_ID, length.toFixed(), 'km');
        updateControlColor(PATH_LENGTH_ID, isLengthValid);
    }

    this.updateElevationGain = function(isElevationGainValid, elevationGain) {
        updateControlValue(ELEVATION_GAIN_ID, elevationGain.toFixed(), 'm')
        updateControlColor(ELEVATION_GAIN_ID, isElevationGainValid);
    }

    this.updateElevationLoss = function(isElevationLossValid, elevationLoss) {
        updateControlValue(ELEVATION_LOSS_ID, elevationLoss.toFixed(), 'm')
        updateControlColor(ELEVATION_LOSS_ID, isElevationLossValid);
    }

    this.updateElevationTotalChange = function(isElevationTotalChangeValid, elevationTotalChange) {
        updateControlValue(ELEVATION_TOTAL_CHANGE_ID, elevationTotalChange.toFixed(), 'm');
        updateControlColor(ELEVATION_TOTAL_CHANGE_ID, isElevationTotalChangeValid);
    }

    this.updateNumberOfStations = function(areAllStationsPresent) {
        updateControlColor(NUMBER_OF_STATIONS_ID, areAllStationsPresent);
    }
    this.updateStationsOrderAndNaming = function(isStationOrderCorrect, isStationNamingCorrect) {
        updateControlColor(STATIONS_ORDER_AND_NAMING_ID, isStationOrderCorrect && isStationNamingCorrect);
    }

    this.updatePathStartEndMarked = function(isPathStartMarked, isPathEndMarked) {
        updateControlColor(STATIONS_START_END_MARKED_ID, isPathStartMarked && isPathEndMarked);
    }

    this.updateSinglePath = function(isSinglePath) {
        updateControlColor(SINGLE_PATH_ID, isSinglePath);
    }
}
