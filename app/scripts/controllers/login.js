(function () {

  'use strict';

  angular
    .module('TodayApp')
    .controller('LoginCtrl', LoginCtrl);

  function LoginCtrl ($scope, simpleLogin, $location) {
    $scope.oauthLogin = function(provider) {
      $scope.err = null;
      simpleLogin.login(provider, {rememberMe: true}).then(redirect, showError);
    };

    $scope.anonymousLogin = function() {
      $scope.err = null;
      simpleLogin.anonymousLogin({rememberMe: true}).then(redirect, showError);
    };

    function redirect() {
      $location.path('/account');
    }

    function showError(err) {
      $scope.err = err;
    }
  }

})();