const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Question = require('../models/Question');
const verifyAdmin = require('../middleware/verifyAdmin');

// ✅ Validation Middleware
const questionValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('question').trim().notEmpty().withMessage('Question is required'),
];

// 📩 POST: Submit a new question
router.post('/', questionValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { name, email, question } = req.body;

    const newQuestion = new Question({ name, email, question });
    await newQuestion.save();

    console.log(`✅ New question submitted by ${name}`);

    res.status(201).json({
      success: true,
      message: 'Your question has been submitted successfully.',
    });
  } catch (error) {
    console.error('❌ Error while saving question:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
});

// 📥 GET: Fetch all submitted questions (Admin Only)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      total: questions.length,
      questions,
    });
  } catch (error) {
    console.error('❌ Error fetching questions:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve questions. Please try again later.',
    });
  }
});

module.exports = router;
