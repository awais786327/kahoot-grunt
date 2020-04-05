(function (){

  'use strict';

  angular
    .module('underscore', [])
    .factory('_', ['$window', function($window) {
      return $window._; // assumes underscore has already been loaded on the page
    }]);

  angular
    .module('TodayApp', [
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'firebase',
      'firebase.utils',
      'simpleLogin',
      'underscore'
    ]);

})();