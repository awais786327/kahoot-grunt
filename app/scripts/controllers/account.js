(function () {

  'use strict';

  angular
    .module('TodayApp')
    .controller('AccountCtrl', AccountCtrl);

  function AccountCtrl ($scope, user, simpleLogin, fbutil, $timeout) {
    $scope.user = user;
    $scope.logout = simpleLogin.logout;
    $scope.messages = [];
    var profile;
    loadProfile(user);

    function loadProfile(user) {
      if( profile ) {
        profile.$destroy();
      }
      profile = fbutil.syncObject('users/'+user.uid);
      profile.$bindTo($scope, 'profile');
    }
  }

})();