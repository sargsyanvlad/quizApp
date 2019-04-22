const quizController = require('../controllers/quizController');

module.exports = function (app) {
    app.route('/auth/question')
        .post(quizController.createQuestion)
        .get(quizController.getAllQuestions);

    app.route('/auth/question/total/')
        .get(quizController.getTotalPoints);

    app.route('/auth/question/list/')
        .get(quizController.getQuizList)
        .post(quizController.createQuizList);

    app.route('/auth/question/list/:id')
        .get(quizController.getQuizListById);

    app.route('/auth/question/:id')
        .get(quizController.getQuestionById)
        .post(quizController.acceptAnswer);
    app.route('/auth/isPassed/:id')
        .get(quizController.isPassedQuiz);
};
