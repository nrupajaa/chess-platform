const express = require('express');
const Repertoire = require('../models/Repertoire');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's repertoires
router.get('/', auth, async (req, res) => {
  try {
    const repertoires = await Repertoire.find({ user: req.user._id });
    res.json(repertoires);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create repertoire
router.post('/', auth, async (req, res) => {
  try {
    const { name, color } = req.body;
    
    const repertoire = new Repertoire({
      user: req.user._id,
      name,
      color: color || 'both',
      openings: []
    });
    
    await repertoire.save();
    res.status(201).json(repertoire);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add opening to repertoire
router.post('/:id/openings', auth, async (req, res) => {
  try {
    const repertoire = await Repertoire.findById(req.params.id);
    
    if (!repertoire || repertoire.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Repertoire not found' });
    }

    const opening = {
      ...req.body,
      masteryLevel: 'beginner',
      progress: 0,
      lastStudied: new Date()
    };

    repertoire.openings.push(opening);
    repertoire.updatedAt = new Date();
    await repertoire.save();

    res.json(repertoire);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update opening in repertoire
router.put('/:id/openings/:openingId', auth, async (req, res) => {
  try {
    const repertoire = await Repertoire.findById(req.params.id);
    
    if (!repertoire || repertoire.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Repertoire not found' });
    }

    const opening = repertoire.openings.id(req.params.openingId);
    if (!opening) {
      return res.status(404).json({ message: 'Opening not found' });
    }

    Object.assign(opening, req.body);
    repertoire.updatedAt = new Date();
    await repertoire.save();

    res.json(repertoire);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete opening from repertoire
router.delete('/:id/openings/:openingId', auth, async (req, res) => {
  try {
    const repertoire = await Repertoire.findById(req.params.id);
    
    if (!repertoire || repertoire.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Repertoire not found' });
    }

    repertoire.openings.id(req.params.openingId).remove();
    repertoire.updatedAt = new Date();
    await repertoire.save();

    res.json(repertoire);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
