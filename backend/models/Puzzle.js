const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema({
  fen: {
    type: String,
    required: true
  },
  moves: [{
    san: String,
    uci: String
  }],
  solution: [{
    san: String,
    uci: String
  }],
  category: {
    type: String,
    enum: ['tactics', 'endgame', 'opening', 'middlegame'],
    required: true
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  theme: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 1200
  },
  attempts: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  },
  userStats: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attempts: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    lastAttempt: { type: Date, default: Date.now },
    nextReview: { type: Date, default: Date.now },
    interval: { type: Number, default: 1 } // Spaced repetition interval in days
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Puzzle', puzzleSchema);
