var logger = require('loglevel');
var _ = require('./lodash');
var pointOnLine = require('@turf/point-on-line');

module.exports = function (points, lineString) {
    // Constructor
    this.points = points;
    this.path = lineString;
    this.pathReversed = false;

    this._sortPoints = function() {
        var path = this.path;
        var enhancedPoints = _.map(this.points, function (point) {
            point.properties.nearestOnLine = pointOnLine(path, point, 'meters');
            return point;
        });

        var sortedPoints = _.sortBy(enhancedPoints, function (point) {
            return point.properties.nearestOnLine.properties.location;
        })

        this.points = sortedPoints;
    }

    this._addIndexes = function() {
        var getIndex = function(str) {
            var START_NAMES_REGEX = /^(wstęp|wprowadzenie|początek|start)$/ig;
            var END_NAMES_REGEX = /^(zakończenia|koniec|podsumowanie)$/ig;
            var ROMAN_NUMBERS_REGEX = /^(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV)$/g;
            var EUROPEAN_NUMBERS_REGEX = /^(1[0-4]|[1-9])$/g;
            var SPLITTER_REGEX = /[ ,\._\-:;]+/;
            var ROMAN_EUROPEAN_MAP = {
                'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7,
                'VIII': 8, 'IX': 9, 'X': 10, 'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14
            };

            var index = null;

            logger.debug('Checking station index for string: ' + str);
            
            // noname station
            if (!str) {
                return index;
            }

            // split
            var parts = str.trim().split(SPLITTER_REGEX);

            _.forEach(parts, function (part) {
                // try roman numbers
                var matches = part.match(ROMAN_NUMBERS_REGEX);
                if (!_.isNull(matches)) {
                    index = ROMAN_EUROPEAN_MAP[matches[0]];
                    return false;
                }

                // try european numbers
                var matches = part.match(EUROPEAN_NUMBERS_REGEX);
                if (!_.isNull(matches)) {
                    index = parseInt(matches[0]);
                    return false;
                }

                // try start names
                var matches = part.match(START_NAMES_REGEX);
                if (!_.isNull(matches)) {
                    index = 0;
                    return false;
                }

                // try end names
                var matches = part.match(END_NAMES_REGEX);
                if (!_.isNull(matches)) {
                    index = 15;
                    return false;
                }
            });
            
            return index;
        }

        this.points = _.map(this.points, function (point) {
            var name = point.properties.name;
            var number = getIndex(name);

            point.properties.index = number;
            return point;
        });
    }

    this._updateDirection = function() {
        var ascIndexes = 0;
        var descIndexes = 0;
        for(var i = 1; i < this.points.length; i++) {
            var currentIndex = this.points[i].properties.index;
            var previousIndex = this.points[i-1].properties.index;
            if (currentIndex > previousIndex) {
                ascIndexes++;
            } else if (currentIndex < previousIndex) {
                descIndexes++;
            }
        }
        if (descIndexes > ascIndexes) {
            logger.debug('Reversed path detected.');
            this.pathReversed = true;
            this.points = this.points.reverse();
        }
    }

    this._sortPoints();
    this._addIndexes();
    this._updateDirection();
    
    this.getCount = function () {
        var numberOfStations = 0;
        for (var stationNumber = 1; stationNumber <= 14; stationNumber++) {
            var firstStationName = '';
            var stationsOfNumber = _.filter(this.points, function (station) {
                if (station.properties.index === stationNumber) {
                    firstStationName = station.properties.name;
                    return true;
                } else {
                    return false;
                }
            });
            if (stationsOfNumber.length !== 1) {
                logger.warn('Station ' + stationNumber + ' found ' + stationsOfNumber.length + ' times.');
            } else {
                logger.debug('Station ' + stationNumber + ' found. Station name: ' + firstStationName);
                numberOfStations++;
            }
        }
        return numberOfStations;
    }

    this.isOrderCorrect = function () {
        var result = true;
        for(var i = 1; i < this.points.length; i++) {
            var currentStationNumber = this.points[i].properties.index;
            var previousStationNumber = this.points[i-1].properties.index;
            logger.debug('Point ' + (i-1));
            if (currentStationNumber === null) {
                logger.debug('Not checking order for unrecognized point: ' + this.points[i].properties.name);
            } else if (previousStationNumber === null) {
                logger.debug('Not checking order for unrecognized point: ' + this.points[i-1].properties.name);
            } else if (currentStationNumber <= previousStationNumber) {
                logger.warn('Detected invalid order of stations. Station ' + currentStationNumber + ' is after station ' + previousStationNumber + '.');
                result = false;
            } else {
                logger.debug('Station ' + currentStationNumber + ' is after station ' + previousStationNumber + '.');
            }
        }
        return result
    }

    this.areAllOnThePath = function(maximumDistanceFromPath) {
        var result = true;

        _.forEach(this.points, function (station, index) {
            var stationNumber = station.properties.index;
            var distanceFromStationToPath = station.properties.nearestOnLine.properties.dist;
            logger.debug('Point ' + index);
            if (stationNumber === null) {
                logger.debug('Not checking distance for: ' + station.properties.name);
            } else if (distanceFromStationToPath > maximumDistanceFromPath) {
                logger.warn('Station ' + stationNumber + ' is too far from path. Expected maximum distance from path: ' + maximumDistanceFromPath + ' meter(s).');
                result = false;
            } else {
                logger.debug('Station ' + stationNumber + ' is on the path.');
            }
        });

        return result;
    }

    this.isPathReversed = function() {
        return this.pathReversed;
    }
}
