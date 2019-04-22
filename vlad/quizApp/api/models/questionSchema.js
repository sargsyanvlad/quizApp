const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const QuestionSchema = new Schema({
    created: {
        type: Date,
        default: Date.now,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true,
        default: 3,
    },
    answers: {
        type: Object,
        required: true
    },
    questionPoint: {
        type: Number,
        required: true,
        default: 0,
    },
    correctAnswer: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Question', QuestionSchema);