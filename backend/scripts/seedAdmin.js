const User = require("../models/user");
const bcrypt = require("bcryptjs");

const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD = "Mano@123";

/**
 * Ensures the admin user exists. Call this after DB connection.
 */
const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ username: ADMIN_USERNAME });
    if (existingAdmin) {
      existingAdmin.role = "ADMIN";
      existingAdmin.isBlocked = false;
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log("Admin user updated.");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const adminUser = new User({
      username: ADMIN_USERNAME,
      password: hashedPassword,
      role: "ADMIN",
    });
    await adminUser.save();
    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

module.exports = seedAdmin;
