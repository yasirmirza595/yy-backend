// createAdmin.js
const mongoose = require("mongoose");
const Admin = require("./models/adminModel");
const dotenv = require("dotenv");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      console.error("❌ ADMIN_USERNAME or ADMIN_PASSWORD missing in .env");
      process.exit(1);
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`⚠️ Admin "${username}" already exists`);
      process.exit(0);
    }

    const newAdmin = new Admin({
      username,
      password, // Schema will hash it
    });

    await newAdmin.save();
    console.log(`✅ Admin "${username}" created successfully`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
