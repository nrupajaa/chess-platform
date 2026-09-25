const express = require('express');
const Puzzle = require('../models/Puzzle');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get puzzles for practice
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, theme } = req.query;
    let query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = parseInt(difficulty);
    if (theme) query.theme = { $regex: theme, $options: 'i' };

    const puzzles = await Puzzle.find(query).limit(20);
    res.json(puzzles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get puzzle by ID
router.get('/:id', async (req, res) => {
  try {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found' });
    }
    res.json(puzzle);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit puzzle solution with spaced repetition
router.post('/:id/solve', auth, async (req, res) => {
  try {
    const { correct, timeTaken } = req.body;
    const puzzle = await Puzzle.findById(req.params.id);
    
    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found' });
    }

    // Update puzzle statistics
    puzzle.attempts += 1;
    const successRate = puzzle.userStats.filter(s => s.user.toString() === req.user._id.toString()).reduce((sum, s) => sum + (s.correct / s.attempts), 0);
    puzzle.successRate = ((puzzle.successRate * (puzzle.attempts - 1)) + (correct ? 1 : 0)) / puzzle.attempts;
    await puzzle.save();

    // Update user statistics
    const user = await User.findById(req.user._id);
    user.stats.puzzlesSolved += 1;
    if (correct) {
      user.stats.currentStreak += 1;
      user.stats.puzzlesAccuracy = ((user.stats.puzzlesAccuracy * (user.stats.puzzlesSolved - 1)) + 1) / user.stats.puzzlesSolved;
    } else {
      user.stats.currentStreak = 0;
      user.stats.puzzlesAccuracy = ((user.stats.puzzlesAccuracy * (user.stats.puzzlesSolved - 1)) + 0) / user.stats.puzzlesSolved;
    }
    await user.save();

    // Update user's puzzle stats with spaced repetition
    let userStat = puzzle.userStats.find(s => s.user.toString() === req.user._id.toString());
    if (!userStat) {
      userStat = {
        user: req.user._id,
        attempts: 0,
        correct: 0,
        lastAttempt: new Date(),
        nextReview: new Date(),
        interval: 1
      };
      puzzle.userStats.push(userStat);
    }

    userStat.attempts += 1;
    userStat.lastAttempt = new Date();
    
    if (correct) {
      userStat.correct += 1;
      // Increase interval for correct answers (spaced repetition)
      userStat.interval = Math.min(userStat.interval * 2, 30); // Max 30 days
    } else {
      // Reset interval for incorrect answers
      userStat.interval = 1;
    }
    
    userStat.nextReview = new Date(Date.now() + userStat.interval * 24 * 60 * 60 * 1000);
    await puzzle.save();

    res.json({
      correct,
      nextReview: userStat.nextReview,
      stats: {
        puzzlesSolved: user.stats.puzzlesSolved,
        accuracy: user.stats.puzzlesAccuracy,
        currentStreak: user.stats.currentStreak
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get puzzles due for review (spaced repetition)
router.get('/review/due', auth, async (req, res) => {
  try {
    const puzzles = await Puzzle.find({
      'userStats.user': req.user._id,
      'userStats.nextReview': { $lte: new Date() }
    });

    res.json(puzzles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create puzzle (instructor only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can create puzzles' });
    }

    const puzzle = new Puzzle(req.body);
    await puzzle.save();

    res.status(201).json(puzzle);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
