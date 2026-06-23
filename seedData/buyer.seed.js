const User = require("../models/users.model");
const buyerData = require("../data/buyer.data");

const seedBuyers = async () => {
  console.log("Seeding buyers...");
  for (const buyer of buyerData) {
    const existing = await User.findOne({ email: buyer.email });
    let userId;
    if (existing) {
      if (existing.password !== buyer.password || existing.role !== buyer.role || existing.name !== buyer.name) {
        const updated = await User.updateCredentials(buyer.email, buyer.password, buyer.role, buyer.name);
        userId = updated._id;
        console.log(`Buyer '${buyer.email}' credentials updated.`);
      } else {
        userId = existing._id;
        console.log(`Buyer '${buyer.email}' verified.`);
      }
    } else {
      const created = await User.create({
        name: buyer.name,
        email: buyer.email,
        password: buyer.password,
        role: buyer.role,
      });
      userId = created._id;
      console.log(`Buyer '${buyer.email}' seeded.`);
    }

    // Verify or create Buyer profile
    await User.getOrCreateBuyerProfile(userId, buyer.address);
  }
};

module.exports = seedBuyers;
