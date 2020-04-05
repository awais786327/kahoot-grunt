(function () {

  'use strict';

  angular
    .module('TodayApp')
    .controller('HostCtrl', HostCtrl);

  function HostCtrl ($scope, Host, Trivia, $routeParams,$interval,fbutil) {
    var $ = window.jQuery;
    function animateList () {
      Materialize.showStaggeredList('#staggered-test')
    }
    Host.init($routeParams.PIN)
      .then(function() {
        Materialize.toast('Welcome!', 2000);
        return Host.setupGame()
      })
      .then(function() {
        Host.syncObject.$bindTo($scope, 'game');
        $scope.$watch('game.data.users', function(newValue, oldValue) {
          if ($scope.game.data.users != undefined) {
            $('.collapsible').collapsible('close', 2);
            $('.collapsible').collapsible('open', 2);
            animateList()
          } else {
            $('.collapsible').collapsible('close', 2);
          }
        });
        $scope.$watch('game.data.state', function(newValue, oldValue) {
          //console.info($scope.game.data.state);
          //if ($scope.game.data.state == 'question') {
          //  Materialize.toast($toastContent);
          //}
          $(document).ready(function(){
            $('.tooltipped').tooltip({delay: 50});
            $('.collapsible').collapsible({onOpen: function(el) {
              animateList()
            }});
          });
          switch(newValue) {

            case 'preQuestion':
              $scope.countdown = 5;
              $interval(function() {
                $scope.countdown--;
              },1000, $scope.countdown)
                .then(function() {
                  Host.setGameState('question');
                });
              break;

            case 'question':
              $scope.currentQuestion = Host.getCurrentQuestion();
              $scope.answers = Trivia.getPossibleAnswers($scope.currentQuestion);
              $scope.game.data.possibleAnswers = $scope.answers;
              $scope.countdown = 7;
              $interval(function() {
                $scope.countdown--;
              },1000, $scope.countdown)
                .then(function() {
                  Host.setGameState('postQuestion');
                });
              break;

            case 'postQuestion':
              $scope.correct = [];
              $scope.currentQuestion = Host.getCurrentQuestion();
              angular.forEach($scope.game.data.users, function(v,k) {

                if(Trivia.checkAnswer(Host.getCurrentQuestion().q, v.answer)) {
                  v.currentPoints = (v.currentPoints || 0) + 100;
                  $scope.correct.push(v.screen_name);
                }
              });
              Host.syncObject.$save();
              break;

            case 'leaderboard':
              $scope.leaderboard = _.map($scope.game.data.users, function(user) {
                return {
                  screen_name:user.screen_name,
                  current_points:user.currentPoints
                }
              })
          }

        })
      });

    $scope.startGame = function() {
      $scope.game.data.state = 'preQuestion'
    };

    $scope.nextQuestion = function() {
      // $scope.game.data.currentQuestion++;
      Host.nextQuestion();
    };

    $scope.endGame = function() {
      Host.setGameState('leaderboard');
    };

  }

})();