const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['foundations', 'openings', 'tactics', 'middlegame', 'endgames', 'advanced'],
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  instructor: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  lessons: [{
    title: String,
    content: String,
    videoUrl: String,
    duration: String,
    order: Number,
    completed: { type: Boolean, default: false }
  }],
  puzzles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Puzzle'
  }],
  requirements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  imageUrl: String,
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
