(function () {

	'use strict';

	angular
			.module('TodayApp')
			.service('Trivia', Trivia);

	function Trivia (_) {
		// AngularJS will instantiate a singleton by calling "new" on this function

		var self = this;

		self.questions = [
			{
				'q':'what is 1 + 1 ?',
				'wrong_answers' : ['three', 'four', 'one'],
				'answer' : 'two'
			},
			{
				'q':'what is 1 + 2 ?',
				'wrong_answers' : ['four', 'two', 'one'],
				'answer' : 'three'
			},
			{
				'q':'what is 1 + 3 ?',
				'wrong_answers' : ['one', 'three', 'two'],
				'answer' : 'four'
			}
		];

		self.getQuiz = function () {
			return self.questions;
		};

		self.setQuiz = function (newQuiz) {
			self.questions = newQuiz;
		};

		self.getQuestions = function () {
			return _.shuffle(self.questions)
		};

		self.getPossibleAnswers = function (question) {
			return _.shuffle([question.answer].concat(question.wrong_answers))
		};

		self.checkAnswer = function (questionText, answer) {
			console.log('Checking:');

			var question = _.find(self.questions, function(q) {
				return q.q == questionText;
			});
			console.log(questionText, answer, question.answer == answer);
			return question.answer == answer;
		}

	}

})();