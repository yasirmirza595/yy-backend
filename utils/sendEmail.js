const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Verify connection configuration
    await transporter.verify();
    console.log('✅ Email transporter is ready');

    const mailOptions = {
      from: `"Yasin & Yasir Automotive" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`📨 Email sent: ${info.messageId} to ${to}`);
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    throw new Error('❌ Email failed to send. Reason: ' + error.message);
  }
};

module.exports = sendEmail;
