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
    answers: {
        type: Object,
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Question', QuestionSchema);