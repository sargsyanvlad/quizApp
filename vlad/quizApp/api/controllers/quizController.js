const questionModel = require('../models/questionSchema');
const questionListModel = require('../models/questionListSchema');
const userModel = require('../models/userSchema');



class QuestionControllerClass {
    constructor() {
        this.getQuestionById = this.getQuestionById.bind(this);
        this.getQuizListById = this.getQuizListById.bind(this);
        this.getAllQuestions = this.getAllQuestions.bind(this);
        this.createQuizList = this.createQuizList.bind(this);
        this.createQuestion = this.createQuestion.bind(this);
        this.acceptAnswer = this.acceptAnswer.bind(this);
        this.isPassedQuiz = this.isPassedQuiz.bind(this);
        this.getQuizList = this.getQuizList.bind(this);
        this.models = {
            questionModel,
            userModel,
            questionListModel,
        };
    }

    async getQuestionById(req, res) {
        try {
            const { id } = req.params;
            if(!id) return res.status(400).send({ success: false, msg: 'Please Pass Right ID' });
            const question = await this.models.questionModel.findById({ _id: id }).lean();
            if(!question) return res.status(400).send({ success: false, msg: 'Cant Find Question' });
            delete question.correctAnswer;

            return res.status(200).send({success: true, question });
        } catch (err) {
            console.log('err->', err);
            return res.status(409).send({ success: false, msg: 'Something Went Wrong' });
        }
    }
    async acceptAnswer(req, res) {
        try {
            const questionId = req.params.id;
            const { answer } = req.body;
            const user = res.locals.user;
            let quizPoints = user.quizPoints;
            const question = await this.models.questionModel.findOne({ _id: questionId });
            if(!questionId || !answer) return res.status(409).send({success: false, msg: "Incorrect Request Body"});

            if( answer.toLowerCase() === question.correctAnswer.toLowerCase() ) {
                quizPoints += question.questionPoint;
                await this.models.userModel.findByIdAndUpdate(user.id, { quizPoints }, {new: true});
                return res.status(200).send({ success: true, message: 'Right Answer', points: quizPoints });
            }

            return res.status(200).send({ success: false, message: 'Wrong Answer', points: quizPoints });
        } catch (err) {
            console.log('err->', err);
            return res.status(409).send({ success: false, msg: 'Something Went Wrong' });
        }
    }

    async getTotalPoints(req, res) {
        try {
            const user = res.locals.user;
            return res.status(200).send({ success: true, totalPoints: user.quizPoints });
        } catch (err) {
            console.log('err->', err);
            return res.status(409).send({ success: false, msg: 'Something Went Wrong' });
        }
    }

    async getQuizList(req, res) {
        try {
            const quizList = await this.models.questionListModel.find();
            return res.status(200).send({success: true, quizList});
        } catch (err) {
            console.log('err->', err);
            return res.status(409).send({ success: false, msg: 'Something Went Wrong' });
        }
    }

    async createQuizList(req, res) {
        try {
            const user = res.locals.user;
            const { questionIds, totalPoints, time } = req.body;
            if(user.role !== 'admin') {
                 return res.status(401).send({ success: false, msg: "Permission Denied" });
            }

            if(!questionIds || !totalPoints || !time) {
                return res.status(409).send({ success: false, msg: 'Incorrect Request body' });
            }
            const createdQuiz = new this.models.questionListModel({ ...req.body });
            const data = await createdQuiz.save();
            return res.status(200).send({ success: true, createdQuiz });
        } catch (err) {
            console.log('err->', err);
            return res.status(409).send({ success: false, msg: 'Something Went Wrong' });
        }
    }

    async getQuizListById(req, res) {
        try {
            const { id } = req.params;
            if(!id) return res.status(400).send({ success: false, msg: 'Please Pass Right ID' });
            const quiz = await this.models.questionListModel.findOne({_id: id});
            if(!quiz) return res.status(400).send({ success: false, msg: 'Cant Find QuizList With Provided id' });

            return res.status(200).send({ success: true, quiz });
        } catch (err) {
            console.log('err->', err);
            return res.status(409).send({ success: false, msg: 'Something Went Wrong' });
        }
    }

    async createQuestion(req, res) {
        try {
            const {
                questions,
                answers,
                questionPoint,
                correctAnswer,
            } = req.body;
            const user = res.locals.user;
            if(user.role !== 'admin') return res.status(401).send({ success: false, msg: "Permission Denied" });

            if(!questions || !answers || questionPoint || !correctAnswer) {
                return res.status(409).send({ success: false, msg: "Incorrect req Body" });
            }

            const question = new this.models.questionModel({ ...req.body });
            await question.save();
            return res.status(200).send({ success: true, msg: "Successfully Created new Question" });
        } catch (err) {
            console.log('err->', err);
            return res.status(409).send({ success: false, msg: 'Something Went Wrong' });
        }
    }

    async getAllQuestions(req, res) {
        try {
            const user = res.locals.user;
            if(user.role === 'admin') {
                const questionsList = await this.models.questionModel.find();

                return res.status(200).send({success: true, questionsList })
            }
            return res.status(401).send({ success: false, msg: "Permission Denied" });
        } catch (err) {
            console.log('err->', err);
            return res.status(409).send({ success: false, msg: 'Something Went Wrong' });
        }
    }

    async isPassedQuiz(req, res) {
        try {
            const user = res.locals.user;
            const quizId = req.params.id;
            const quiz = await this.models.questionListModel.findById({ _id: quizId }).lean();
            if(user.quizPoints >= quiz.totalPoints) {
                return res.status(200).send({ success: true, msg: 'Passed' });
            }
            return res.status(200).send({success: false, msg: 'Not Passed'});
        } catch (err) {
            console.log('err->', err);
            return res.status(409).send({ success: false, msg: 'Something Went Wrong' });
        }
    }
}

module.exports = new QuestionControllerClass();
