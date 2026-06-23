const User = require("../models/users.model");
const sellerData = require("../data/seller.data");

const seedSellers = async () => {
  console.log("Seeding sellers...");
  for (const seller of sellerData) {
    const existing = await User.findOne({ email: seller.email });
    let userId;
    if (existing) {
      if (existing.password !== seller.password || existing.role !== seller.role || existing.name !== seller.name) {
        const updated = await User.updateCredentials(seller.email, seller.password, seller.role, seller.name);
        userId = updated._id;
        console.log(`Seller '${seller.email}' credentials updated.`);
      } else {
        userId = existing._id;
        console.log(`Seller '${seller.email}' verified.`);
      }
    } else {
      const created = await User.create({
        name: seller.name,
        email: seller.email,
        password: seller.password,
        role: seller.role,
      });
      userId = created._id;
      console.log(`Seller '${seller.email}' seeded.`);
    }

    // Verify or create Seller profile
    await User.getOrCreateSellerProfile(userId, seller.shopName);
  }
};

module.exports = seedSellers;
