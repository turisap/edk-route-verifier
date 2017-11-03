
module.exports = function() {
    this.routeUrl = $('div#map-canvas').attr('data-what');
    this.routeParamsUrl = $('div#map-canvas').attr('data-route-params');
    this.isLocal = false;
}

