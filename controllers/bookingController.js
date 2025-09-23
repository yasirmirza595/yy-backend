const Booking = require('../models/Booking');
const sendEmail = require('../utils/sendEmail');

// Create Booking Controller
const createBooking = async (req, res) => {
  try {
    const { name, email, phone, service, vehicle, date, time, status } = req.body;

    // Validation check
    if (!name || !email || !phone || !service || !vehicle || !date || !time) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Validate date format
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use a valid ISO date.' });
    }

    // Optional: Check for past booking (can uncomment if needed)
    // if (new Date(date) < new Date()) {
    //   return res.status(400).json({ success: false, message: 'Booking date cannot be in the past.' });
    // }

    // Create and save booking
    const newBooking = new Booking({
      name,
      email,
      phone,
      service,
      vehicle,
      date,
      time,
      status: status || 'Pending',
    });

    await newBooking.save();
    console.log(`[✔] Booking saved: ${name}, ${email}`);

    // Build confirmation email
    const emailHTML = `
      <h3>Dear ${name},</h3>
      <p>Thank you for booking at <strong>Yasin & Yasir Automotive</strong>.</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p>We look forward to serving you. If you need to make any changes, please contact us in advance.</p>
      <br />
      <p style="font-size:12px;">This is an automated confirmation email. Please do not reply.</p>
    `;

    // Try to send confirmation email
    try {
      await sendEmail(email, 'Booking Confirmation - Yasin & Yasir Automotive', emailHTML);
      console.log(`[📧] Confirmation email sent to: ${email}`);
    } catch (emailErr) {
      console.error(`[✖] Email send failed: ${emailErr.message}`);

      return res.status(201).json({
        success: true,
        message: 'Booking created, but confirmation email failed to send.',
        booking: newBooking,
        emailError: emailErr.message,
      });
    }

    // Success response
    return res.status(201).json({
      success: true,
      message: 'Booking created successfully & confirmation email sent.',
      booking: newBooking,
    });

  } catch (error) {
    console.error('[❌] Booking creation failed:', error.message);
    return res.status(500).json({ success: false, message: 'Server error while creating booking.' });
  }
};

module.exports = { createBooking };
