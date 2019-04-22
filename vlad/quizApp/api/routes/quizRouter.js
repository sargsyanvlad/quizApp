const quizController = require('../controllers/quizController');

module.exports = function (app) {
    app.route('/auth/question/:id', )
        .get(quizController.getQuestionById)
        .post(quizController.acceptAnswer);

    app.route('/auth/question/total')
        .get(quizController.getTotalPoints);

    app.route('/auth/question/list')
        .get(quizController.getQuizList)
        .post(quizController.createQuizList);
};