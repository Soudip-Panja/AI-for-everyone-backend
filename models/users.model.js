const { prisma } = require("../db/connection");

class User {
  /**
   * Find a user by email
   * @param {Object} criteria - Search criteria { email }
   * @returns {Promise<Object|null>} User object mapped for compatibility
   */
  static async findOne({ email }) {
    if (!email) return null;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (!user) return null;

    return {
      _id: user.id, // Mapped to _id to keep JWT payload and controller compatibility
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Create a new user
   * @param {Object} userDetails - { name, email, password, role }
   * @returns {Promise<Object>} Created user details
   */
  static async create({ name, email, password, role = "Buyer" }) {
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password,
        role,
      },
    });

    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Update credentials and name for a user by email
   * @param {string} email 
   * @param {string} password 
   * @param {string} role 
   * @param {string} name 
   * @returns {Promise<Object>} Updated user details
   */
  static async updateCredentials(email, password, role, name) {
    const user = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        password,
        role,
        name,
      },
    });

    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    };
  }

  /**
   * Helper to verify or create a Seller profile row
   * @param {number} userId 
   * @param {string} shopName 
   * @returns {Promise<Object>}
   */
  static async getOrCreateSellerProfile(userId, shopName = "") {
    const existing = await prisma.seller.findUnique({
      where: { userId },
    });
    if (existing) return existing;

    return await prisma.seller.create({
      data: {
        userId,
        shopName,
      },
    });
  }

  /**
   * Helper to verify or create a Buyer profile row
   * @param {number} userId 
   * @param {string} address 
   * @returns {Promise<Object>}
   */
  static async getOrCreateBuyerProfile(userId, address = "") {
    const existing = await prisma.buyer.findUnique({
      where: { userId },
    });
    if (existing) return existing;

    return await prisma.buyer.create({
      data: {
        userId,
        address,
      },
    });
  }
}

module.exports = User;
