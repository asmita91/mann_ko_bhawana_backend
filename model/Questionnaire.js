

// const mongoose = require('mongoose');

// const optionSchema = new mongoose.Schema({
//   text: String,
//   points: Number
// });

// const questionSchema = new mongoose.Schema({
//   questionText: String,
//   options: [optionSchema]
// });

// const resultSchema = new mongoose.Schema({
//   resultId: String,
//   totalScore: Number,

// });

// const Questionnaire = mongoose.model('Questionnaire', questionSchema);
// const Result = mongoose.model('Result', resultSchema);

// module.exports = { Questionnaire, Result };





const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  points: Number
});

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [optionSchema]
});

const resultSchema = new mongoose.Schema({
  resultId: String,
  totalScore: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
});

const Questionnaire = mongoose.model('Questionnaire', questionSchema);
const Result = mongoose.model('Result', resultSchema);

module.exports = { Questionnaire, Result };
