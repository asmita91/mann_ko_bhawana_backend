

const express = require('express');
const router = express.Router();
const questionnaireController = require('../controllers/questionnaireController');

router.post('/submit', questionnaireController.saveResult);
router.get('/results/:userId', questionnaireController.getUserResults);

module.exports = router;
