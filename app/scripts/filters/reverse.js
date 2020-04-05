(function () {

  'use strict';

  angular
    .module('TodayApp')
    .filter('reverse', reverse);

  function reverse() {
    return function(items) {
      return angular.isArray(items)? items.slice().reverse() : [];
    };
  }

})();