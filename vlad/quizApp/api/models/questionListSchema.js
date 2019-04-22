let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//users schema
let QuestionListSchema = new Schema({
    created: {
        type: Date,
        default: Date.now,
        required: true
    },
    questionIds: {
        type: Array,
        default: [1,2,3,4],
        required: true
    }
});

module.exports = mongoose.model('QuestionList', QuestionListSchema);