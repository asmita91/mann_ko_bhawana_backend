
const { Questionnaire, Result } = require('../model/Questionnaire');
const { v4: uuidv4 } = require('uuid');

// Save result
exports.saveResult = async (req, res) => {
  const { answers, userId } = req.body; // Extract userId from the request body
  let totalScore = 0;

  answers.forEach(answer => {
    totalScore += answer.points;
  });

  const resultId = uuidv4();

  const newResult = new Result({
    resultId,
    totalScore,
    user: userId
  });

  try {
    await newResult.save();
    res.status(201).json({ resultId, totalScore });
  } catch (err) {
    console.log("I am in controller", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getUserResults = async (req, res) => {
  try {
    const userId = req.params.userId;
    const results = await Result.find({ user: userId });
    if (!results) {
      return res.status(404).json({ message: 'Results not found' });
    }
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching user results:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
