const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');

// ✅ POST: Send Test Email
router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: '❗ Email is required to send a test message.',
    });
  }

  console.log(`📨 Attempting to send test email to: ${email}`);

  try {
    const subject = '📧 Test Email from Yasin & Yasir Automotive';
    const html = `
      <h2>Assalamualaikum!</h2>
      <p>This is a <strong>test email</strong> from <span style="color:#007bff;">Yasin & Yasir Automotive</span>.</p>
      <p>✅ If you're seeing this, your email system is working properly!</p>
      <br>
      <small style="color:gray;">Do not reply to this automated test message.</small>
    `;

    await sendEmail(email, subject, html);

    console.log('✅ Test email sent successfully!');

    res.status(200).json({
      success: true,
      message: `Test email sent to ${email} successfully.`,
    });
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
    res.status(500).json({
      success: false,
      message: '❌ Failed to send test email. Please verify SMTP settings or internet connectivity.',
    });
  }
});

module.exports = router;
