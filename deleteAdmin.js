// deleteAdmin.js
const mongoose = require("mongoose");
const Admin = require("./models/adminModel");
const dotenv = require("dotenv");

dotenv.config();

const deleteAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const username = process.env.ADMIN_USERNAME;

    if (!username) {
      console.error("❌ ADMIN_USERNAME missing in .env");
      process.exit(1);
    }

    const result = await Admin.deleteOne({ username });

    if (result.deletedCount > 0) {
      console.log(`❎ Admin "${username}" deleted successfully`);
    } else {
      console.log(`ℹ️ No admin found with username "${username}"`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error while deleting admin:", error.message);
    process.exit(1);
  }
};

deleteAdmin();
