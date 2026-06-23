const seedAdmins = require("./admin.seed");
const seedSellers = require("./seller.seed");
const seedBuyers = require("./buyer.seed");

const runSeeder = async () => {
  try {
    console.log("=== START SEEDING PROCESS ===");
    await seedAdmins();
    await seedSellers();
    await seedBuyers();
    console.log("=== SEEDING PROCESS COMPLETE ===");
  } catch (error) {
    console.error("Seeding process failed:", error);
  }
};

module.exports = runSeeder;
