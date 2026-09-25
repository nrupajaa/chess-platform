const mongoose = require('mongoose');

const repertoireSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  openings: [{
    name: {
      type: String,
      required: true
    },
    eco: String,
    moves: [String],
    description: String,
    lessons: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    exampleGames: [{
      white: String,
      black: String,
      result: String,
      pgn: String,
      year: Number
    }],
    masteryLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastStudied: {
      type: Date,
      default: Date.now
    }
  }],
  color: {
    type: String,
    enum: ['white', 'black', 'both'],
    default: 'both'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Repertoire', repertoireSchema);
