const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 🧾 Admin Schema Definition
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  }
}, {
  timestamps: true
});

// 🔐 Hash password before saving (only if modified)
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    console.error('[Hashing Error]', err.message);
    next(err);
  }
});

// 🔍 Compare password method for login
adminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    console.error('[Password Compare Error]', err.message);
    return false;
  }
};

module.exports = mongoose.model('Admin', adminSchema);
