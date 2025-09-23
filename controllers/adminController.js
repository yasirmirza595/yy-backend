const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin login controller
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // Compare password hashes
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // Ensure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('[CONFIG ERROR] JWT_SECRET not set in environment variables.');
      return res.status(500).json({ success: false, message: 'Internal server error. Please contact admin.' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role || 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Future: Save login event with IP / device info (audit log)

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role || 'admin',
      }
    });

  } catch (error) {
    console.error('[LOGIN ERROR]:', error.message);
    return res.status(500).json({ success: false, message: 'Something went wrong during login.' });
  }
};

module.exports = {
  loginAdmin
};
