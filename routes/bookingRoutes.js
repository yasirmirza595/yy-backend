const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const verifyAdmin = require('../middleware/verifyAdmin');

const router = express.Router();

/* 
  📌 Route: POST /api/bookings
  🔓 Public: Anyone can book
*/
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('service').trim().notEmpty().withMessage('Service is required'),
    body('vehicle').trim().notEmpty().withMessage('Vehicle is required'),
    body('date')
      .notEmpty().withMessage('Date is required')
      .custom((value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          throw new Error('Booking date cannot be in the past');
        }
        return true;
      }),
    body('time').notEmpty().withMessage('Time is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const booking = new Booking({
        ...req.body,
        status: req.body.status || 'Pending',
      });

      await booking.save();

      res.status(201).json({ message: '✅ Booking created successfully', booking });
    } catch (error) {
      console.error('❌ Booking creation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

/* 
  📌 Route: GET /api/bookings
  🔐 Protected: Admin only
*/
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/* 
  📌 Route: PUT /api/bookings/:id/status
  🔐 Protected: Admin only
*/
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: '✅ Status updated successfully', booking });
  } catch (error) {
    console.error('❌ Status update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/* 
  📌 Route: DELETE /api/bookings/:id
  🔐 Protected: Admin only
*/
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: '✅ Booking deleted successfully' });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
