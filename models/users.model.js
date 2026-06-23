const { pool } = require("../db/connection");

class User {
  /**
   * Find a user by email
   * @param {Object} criteria - Search criteria { email }
   * @returns {Promise<Object|null>} User object mapped for compatibility
   */
  static async findOne({ email }) {
    if (!email) return null;
    const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";
    const res = await pool.query(query, [email.toLowerCase()]);
    
    if (res.rows.length === 0) return null;

    const user = res.rows[0];
    return {
      _id: user.id, // Mapped to _id to keep JWT payload and controller compatibility
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  /**
   * Create a new user
   * @param {Object} userDetails - { name, email, password, role }
   * @returns {Promise<Object>} Created user details
   */
  static async create({ name, email, password, role = "Buyer" }) {
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id as "_id", name, email, password, role, created_at as "createdAt", updated_at as "updatedAt"
    `;
    const res = await pool.query(query, [name, email.toLowerCase(), password, role]);
    return res.rows[0];
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
    const query = `
      UPDATE users 
      SET password = $1, role = $2, name = $3, updated_at = NOW() 
      WHERE email = $4
      RETURNING id as "_id", name, email, password, role
    `;
    const res = await pool.query(query, [password, role, name, email.toLowerCase()]);
    return res.rows[0];
  }

  /**
   * Helper to verify or create a Seller profile row
   * @param {number} userId 
   * @param {string} shopName 
   * @returns {Promise<Object>}
   */
  static async getOrCreateSellerProfile(userId, shopName = "") {
    const checkQuery = "SELECT * FROM sellers WHERE user_id = $1";
    const checkRes = await pool.query(checkQuery, [userId]);
    if (checkRes.rows.length > 0) return checkRes.rows[0];

    const insertQuery = "INSERT INTO sellers (user_id, shop_name) VALUES ($1, $2) RETURNING *";
    const insertRes = await pool.query(insertQuery, [userId, shopName]);
    return insertRes.rows[0];
  }

  /**
   * Helper to verify or create a Buyer profile row
   * @param {number} userId 
   * @param {string} address 
   * @returns {Promise<Object>}
   */
  static async getOrCreateBuyerProfile(userId, address = "") {
    const checkQuery = "SELECT * FROM buyers WHERE user_id = $1";
    const checkRes = await pool.query(checkQuery, [userId]);
    if (checkRes.rows.length > 0) return checkRes.rows[0];

    const insertQuery = "INSERT INTO buyers (user_id, address) VALUES ($1, $2) RETURNING *";
    const insertRes = await pool.query(insertQuery, [userId, address]);
    return insertRes.rows[0];
  }
}

module.exports = User;
