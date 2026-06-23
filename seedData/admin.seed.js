const User = require("../models/users.model");
const adminData = require("../data/admin.data");

const seedAdmins = async () => {
  console.log("Seeding administrators...");
  for (const admin of adminData) {
    const existing = await User.findOne({ email: admin.email });
    if (existing) {
      if (existing.password !== admin.password || existing.role !== admin.role || existing.name !== admin.name) {
        await User.updateCredentials(admin.email, admin.password, admin.role, admin.name);
        console.log(`Admin '${admin.email}' credentials updated.`);
      } else {
        console.log(`Admin '${admin.email}' verified.`);
      }
    } else {
      await User.create(admin);
      console.log(`Admin '${admin.email}' seeded.`);
    }
  }
};

module.exports = seedAdmins;
