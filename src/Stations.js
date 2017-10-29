var logger = require('loglevel');
var _ = require('./lodash');
var pointOnLine = require('@turf/point-on-line');
var distance = require('@turf/distance');


module.exports = function (points, lineString) {
    // Constructor
    this.points = points;
    this.path = lineString;

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
            var EUROPEAN_NUMBERS_REGEX = /^1[0-4]|[1-9]$/g;
            var SPLITTER_REGEX = /[ ,\._\-:;]+/;
            var ROMAN_EUROPEAN_MAP = {
                'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7,
                'VIII': 8, 'IX': 9, 'X': 10, 'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14
            };

            var index = null;

            // split
            var parts = str.split(SPLITTER_REGEX);

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

    this._addStartEnd = function() {
        var startPoints = _.filter(this.points, function (point) {
            return point.properties.index === 0
        });
        var endPoints = _.filter(this.points, function (point) {
            return point.properties.index === 15
        });
        if (_.isEmpty(startPoints) && _.isEmpty(endPoints)) {
            var firstStation = _.filter(this.points, function (point) {
                return point.properties.index === 1
            });
            if (!_.isEmpty(firstStation)) {
                firstStation = firstStation[0];
                var firstPointOnPath = this.path.geometry.coordinates[0];
                var lastPointOnPath = this.path.geometry.coordinates[this.path.geometry.coordinates.length - 1];
                var distanceToFirstPointOnPath = distance(firstPointOnPath, firstStation, 'meters');
                var distanceToLastPointOnPath = distance(lastPointOnPath, firstStation, 'meters');
                if (distanceToFirstPointOnPath < distanceToLastPointOnPath) {
                    logger.debug('TODO: Add Start at the beginning of the path');
                    logger.debug('TODO: Add End at the end of the path');
                } else {
                    logger.debug('TODO: Add Start at the end of the path');
                    logger.debug('TODO: Add End at the start of the path');
                    // TODO: Reverse path
                }
            }
        } else {
            // TODO
        }
    }

    this._sortPoints();
    this._addIndexes();
    this._addStartEnd();
}
