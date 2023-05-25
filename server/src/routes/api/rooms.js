// routes/api/rooms.js

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middlewares/auth');
const Room = require('../../models/Room');
const User = require('../../models/User');

// @route   POST api/rooms
// @desc    Create a new room
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    try {
      let room = new Room({
        name,
        description,
        users: [req.user.id],
      });

      await room.save();
      res.json(room);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/rooms/:id/join
// @desc    Join a room
// @access  Private
router.put('/:id/join', auth, async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    // Check if the user has already joined the room
    if (room.users.some((user) => user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'User already joined the room' });
    }

    room.users.unshift(req.user.id);

    await room.save();

    res.json(room.users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/rooms/:id/leave
// @desc    Leave a room
// @access  Private
router.put('/:id/leave', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    // Check if the user has joined the room
    const removeIndex = room.users
      .map((user) => user.toString())
      .indexOf(req.user.id);

    if (removeIndex === -1) {
      return res.status(400).json({ msg: 'User has not joined the room' });
    }

    room.users.splice(removeIndex, 1);

    await room.save();

    res.json(room.users);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Room not found' });
    }
    res.status(500).send('Server error');
  }
});
// ...

// @route   POST api/rooms/:id/messages
// @desc    Send a message in a room
// @access  Private
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const room = await Room.findById(req.params.id);

    const newMessage = {
      text: req.body.text,
      name: user.name,
      user: req.user.id,
    };

    room.messages.unshift(newMessage);

    await room.save();

    res.json(room.messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/rooms/:id/messages
// @desc    Get all messages in a room
// @access  Private
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    res.json(room.messages);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Room not found' });
    }
    res.status(500).send('Server error');
  }
});


module.exports = router;
