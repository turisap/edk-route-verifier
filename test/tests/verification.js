module.exports = {

    before : function(client) {

    },

    'Positive test - short path': function (client) {
        client.page.page()
            .navigate(1)
            .verifyRoute()
            .assertSinglePath(true)
            .assertPathLength(52, 1)
            .assertRouteType('Trasa EDK')
            .assertNumberOfStations(true)
            .assertStationsOrder(true)
            .assertStationsOnPath(true)
            .assertElevationGain(300, 20)
            .assertElevationLoss(340, 20)
            .assertElevationTotalChange(650, 20)
            .assertDataConsistency(true);
    },

    'Positive test - circular route': function (client) {
        client.page.page()
            .navigate('2-circular')
            .verifyRoute()
            .assertSinglePath(true)
            .assertPathLength(37, 1)
            .assertRouteType('Trasa EDK')
            .assertNumberOfStations(true)
            .assertStationsOrder(true)
            .assertStationsOnPath(true)
            .assertElevationGain(1580, 20)
            .assertElevationLoss(1580, 20)
            .assertElevationTotalChange(3160, 20)
            .assertDataConsistency(true);
    },

    'Positive test - zero-leading station numbers': function (client) {
        client.page.page()
            .navigate('3-zero_leading')
            .verifyRoute()
            .assertSinglePath(true)
            .assertPathLength(80, 1)
            .assertRouteType('Trasa EDK')
            .assertNumberOfStations(true)
            .assertStationsOrder(true)
            .assertStationsOnPath(false)
            .assertElevationGain(1600, 20)
            .assertElevationLoss(1360, 20)
            .assertElevationTotalChange(2970, 20)
            .assertDataConsistency(true);
    },

    'Positive test - long path': function (client) {
    },

    'Negative test - duplicated station point': function (client) {
        client.page.page()
            .navigate('10-duplicated_station_point')
            .verifyRoute()
            .assertSinglePath(true)
            .assertPathLength(29, 1)
            .assertRouteType('Droga na wzór EDK')
            .assertNumberOfStations(false)
            .assertStationsOrder(false)
            .assertStationsOnPath(true)
            .assertElevationGain(190, 20)
            .assertElevationLoss(145, 20)
            .assertElevationTotalChange(335, 20)
            .assertDataConsistency(true);
    },


    'Negative test - station out of path': function (client) {
        client.page.page()
            .navigate('11-station_out_of_path')
            .verifyRoute()
            .assertSinglePath(true)
            .assertPathLength(44, 1)
            .assertRouteType('Trasa EDK')
            .assertNumberOfStations(true)
            .assertStationsOrder(true)
            .assertStationsOnPath(false)
            .assertElevationGain(220, 20)
            .assertElevationLoss(270, 20)
            .assertElevationTotalChange(490, 20)
            .assertDataConsistency(true);
    },


    'Positive test - circular path': function (client) {
        client.page.page()
            .navigate('12-circular_path')
            .verifyRoute()
            .assertSinglePath(true)
            .assertPathLength(37, 1)
            .assertRouteType('Trasa EDK')
            .assertNumberOfStations(true)
            .assertStationsOrder(true)
            .assertStationsOnPath(true)
            .assertElevationGain(1600, 20)
            .assertElevationLoss(1600, 20)
            .assertElevationTotalChange(3200, 40)
            .assertDataConsistency(true);
    },

    'Negative test - stations in reversed order comparing to path direction': function (client) {
        client.page.page()
            .navigate('13-reversed_path')
            .verifyRoute()
            .assertSinglePath(true)
            .assertPathLength(46, 1)
            .assertRouteType('Trasa EDK')
            .assertNumberOfStations(true)
            .assertStationsOrder(false)
            .assertStationsOnPath(true)
            .assertElevationGain(880, 20)
            .assertElevationLoss(920, 20)
            .assertElevationTotalChange(1800, 40)
            .assertDataConsistency(true);
    },

    after: function(client) {
        client.end();
    }
};
