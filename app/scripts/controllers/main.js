(function () {

	'use strict';

	angular
			.module('TodayApp')
			.controller('MainCtrl', MainCtrl);

	function MainCtrl ($scope, $location, _, fbutil, $timeout, Trivia) {

		$scope.creatingGame = false;
		$scope.secrete_key = null;
		$scope.hasAccess = false;
		$scope.verifying = false;
		$scope.question = {
			value: null
		};
		$scope.correctAns = null;
		$scope.customQuiz = Trivia.getQuiz();

		$(document).ready(function(){
			$('.carousel').carousel();
			$('input#verify').characterCounter();
			$('.modal').modal({
						dismissible: true, // Modal can be dismissed by clicking outside of the modal
						ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
							//console.log('modal open', modal, trigger);
						},
						complete: function(modal) {
							//console.log('modal close', modal);
						} // Callback for Modal close
					});

		});

		$scope.verify = function (code) {
			$scope.verifying = true;

			$timeout(function () {
				$scope.verifying = false;
				$scope.hasAccess = true;
				$timeout(function () {
					//$('#sortable').sortable();
					initSelectOptionForMobile(function () {
						// set secrete code
						$scope.secrete_key = code;
						initChips();
						// trigger event when option select
						$('.chips').on('chip.select', function(e, chip){
							$scope.correctAns = chip.tag;
							//console.info(chip);
						});
					});
				});
				Materialize.toast("Authenticated", 2000);
			}, 3000);
		};
		$scope.openTarget = function () {
			$('.tap-target').tapTarget('open');
		};
		$scope.newGame = function () {
			$scope.creatingGame = true;

			// Generate random 6 digit pincode for the game
			var PIN = _.random(100000,999999),

			// Connect to Firebase
					game = fbutil.syncObject('games/' + PIN);

			// Upon connection build game object
			game.$loaded().then(function() {
						game.data = {
							'state'  : 'waitingForPlayers',
						};
						return game.$save();
					})
					.then(function() {
						// after save is completed take us to Host view
						$location.path('/host/' + PIN);
					})
		};
		$scope.addQuestion = function (question) {
			var allAnswers = [];
			if ($scope.question.value != null) {
				if (getOptions().length != 0) {
					if ($scope.correctAns != null) {

						// do the stuff
						allAnswers = getOptions();
						removeSelectedAnswerFromOption (allAnswers, function (wrongAnswers) {
							$scope.customQuiz.unshift({
								'q': (question.value.slice(-1) === '?') ? question.value : (question.value + ' ?'),
								'wrong_answers' : wrongAnswers,
								'answer' : getCorrectAns().toString()
							});
							$scope.question.value = null;
							$scope.correctAns = null;
							$('.set-options').material_chip('remove');
							// re-init chips
							initChips();
						});
					} else {
							Materialize.toast("Select correct answer", 2000);
					}
				} else {
					Materialize.toast("<span class='yellow-text'>You must fill the options</span>", 2000);
				}
			} else {
				Materialize.toast("Write question first", 2000);
			}
		};
		$scope.changeCorrectOption = function (parentIndex, option, index) {
			var temp = $scope.customQuiz[parentIndex].answer;
			$scope.customQuiz[parentIndex].answer = $scope.customQuiz[parentIndex].wrong_answers[index];
			$scope.customQuiz[parentIndex].wrong_answers[index] = temp;
		};
		$scope.saveChanges = function () {
			Trivia.setQuiz($scope.customQuiz);
		};

		function getOptions () {
			return $('.set-options').material_chip('data')
		}
		function getSecreteKey () {
			return $scope.secrete_key
		}
		function getCorrectAns () {
			return $scope.correctAns
		}
		function initSelectOptionForMobile (CB) {
			$('select').material_select();
			CB()
		}
		function removeSelectedAnswerFromOption (allAnswers, CB) {
			var filteredAnswer = allAnswers.filter(function (answer) {
				return answer.tag != getCorrectAns()
			}).map(function (answer) {
				return answer.tag
			});
			CB (filteredAnswer);
		}
		function initChips () {
			// for new options
			$('.set-options').material_chip({
				placeholder: 'Options (max 4)',
				maxTags: 4,
				secondaryPlaceholder: '+',
				autocompleteOptions: {
					data: {
						'None of the above': null,
						'All of the above': null
					},
					limit: Infinity,
					minLength: 1
				}
			});
		}
	}

})();