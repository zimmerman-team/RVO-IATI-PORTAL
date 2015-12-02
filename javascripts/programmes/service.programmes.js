/**
* Posts
* @namespace ncs.collections.services
*/
(function () {
    'use strict';

    angular
        .module('oipa.programmes')
        .factory('Programmes', Programmes);

    Programmes.$inject = [];

    /**
    * @namespace Filters
    * @returns {Factory}
    */
    function Programmes() {
        var m = this;
        m.selectedProgrammes = [];

        var Programmes = {
            selectedProgrammes: m.selectedProgrammes,
        };

        return Programmes;
    }
})();