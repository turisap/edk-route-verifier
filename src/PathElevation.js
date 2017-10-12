module.exports = function(elevations, length) {
    var getGain = function(elevations) {
        var elevationGain = 0.0;
        for(var i = 1; i < elevations.length; i++) {
            var elevationDifference = elevations[i].elevation - elevations[i-1].elevation;
            elevationGain += (elevationDifference > 0) ? elevationDifference : 0.0;
        }
        return Number(elevationGain);
    }
    var getLoss = function(elevations) {
        var elevationLoss = 0.0;
        for(var i = 1; i < elevations.length; i++) {
            var elevationDifference = elevations[i-1].elevation - elevations[i].elevation;
            elevationLoss += (elevationDifference > 0) ? elevationDifference : 0.0;
        }
        return Number(elevationLoss);
    }

    this.gain = getGain(elevations);
    this.loss = getLoss(elevations);
    this.totalChange = this.loss + this.gain;
    this.data = elevations;

    this.enrichData = function(length) {
        var elevationsWithDistance = [];
        var resolution = length / this.data.length;
        for(var i = 0; i < this.data.length; i++) {
            elevationsWithDistance.push({elevation: this.data[i].elevation, distance: i * resolution});
        }
        this.data = elevationsWithDistance;
    }
}

