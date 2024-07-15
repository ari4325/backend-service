const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const List = require('../models/List');
const User = require('../models/User');

// Create list
router.post('/', auth, async (req, res) => {
  const { name, responseCodes } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const newList = new List({ name, responseCodes, user: user.id });
    const list = await newList.save();
    user.lists.push(list.id);
    await user.save();
    res.json(list);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all lists
router.get('/', auth, async (req, res) => {
  try {
    const lists = await List.find({ user: req.user.id });
    res.json(lists);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Edit list
router.put('/:id', auth, async (req, res) => {
  const { name, responseCodes } = req.body;
  try {
    let list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ msg: 'List not found' });

    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    list = await List.findByIdAndUpdate(
      req.params.id,
      { $set: { name, responseCodes } },
      { new: true }
    );
    res.json(list);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete list
router.delete('/:id', auth, async (req, res) => {
  try {
    let list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ msg: 'List not found' });

    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await List.findByIdAndRemove(req.params.id);
    res.json({ msg: 'List removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
