var map;

//TODO: Remove
var testRouteId = [
    '9d13a0acad3ef4da05da04efba7a779e8d91f592',
    '167fb6420c15fa6f155c091bf9dde192bd7e5309',
    '56adb3f60f82870e833daaaab2301f49ab6e032b',
    'd53606410e75db67d35bff07b49846f5d4ed0bc5',
    '167fb6420c15fa6f155c091bf9dde192bd7e5309']

var routeId = '9d13a0acad3ef4da05da04efba7a779e8d91f592';
var src = 'http://rejony.edk.org.pl/api/edk/route-files/' + routeId +'/download/gps';

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(-19.257753, 146.823688),
        zoom: 2,
        mapTypeId: 'terrain'
    });

    var kmlLayer = new google.maps.KmlLayer(src, {
        suppressInfoWindows: true,
        preserveViewport: false,
        map: map
    });
    kmlLayer.addListener('click', function(event) {
        var content = event.featureData.infoWindowHtml;
        var testimonial = document.getElementById('capture');
        testimonial.innerHTML = content;
    });
}
