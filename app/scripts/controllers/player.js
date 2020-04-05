(function () {

	'use strict';

	angular
			.module('TodayApp')
			.controller('PlayerCtrl', PlayerCtrl);

	function PlayerCtrl ($scope, $rootScope, Player, $location,$routeParams) {
		$(document).ready(function() {
			Materialize.updateTextFields();
		});
		if(! $routeParams.hasOwnProperty('PIN')) {
			$scope.game = {
				data : {
					state: 'joinGame'
				}

			}
		} else {
			Player.init($routeParams.PIN)
					.then(function() {

						// $scope.clearAnswer();

					})
					.then(function() {

						Player.syncObject.$bindTo($scope,'game')
								.then(function() {

									$scope.currentQuestion = $scope.game.data.questions[$scope.game.data.currentQuestion];

									$scope.$watch('game.data.currentQuestion' , function(newValue, oldValue) {
										$scope.clearAnswer();
										$scope.currentQuestion = $scope.game.data.questions[$scope.game.data.currentQuestion];
									});

								});

						$scope.playerId = Player.getUniqId();

					});
		}
		$scope.joining = false;
		$scope.join = function(form) {
			if(form.$valid) {
				$rootScope.loading = true;
				$scope.joining = true;
				Player.join($scope.PIN, $scope.screenName)
						.then(function(status) {
							// stop loading weather it have status or not
							$rootScope.loading = false;

							if(status !== 'INCORRECT-PIN') {
								$location.path('/player/' + $scope.PIN)
							} else {
								Materialize.toast('<span class="orange-text">Incorrect Pin</span>', 2000);
								// reset loading
								$scope.joining = false;
								// reset form
								$scope.joinform.$setPristine();
								// clear fields
								$scope.$parent.PIN = '';
							}
						});
			} else {
				console.info(form)
				Materialize.toast('<span class="white-text">Incorrect name format</span>', 2000);
			}
		};
		$scope.clearAnswer = function() {
			Player.saveSelfAttr('answer', null);
		}
		$scope.saveAnswer = function(answer) {
			Player.saveSelfAttr('answer', answer);
		};

	}

})();