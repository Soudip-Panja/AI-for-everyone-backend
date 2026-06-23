const { Pool } = require("pg");
const { DATABASE_URL } = require("../config/env");

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes("sslmode=require") || DATABASE_URL.includes("aws.neon.tech")
    ? { rejectUnauthorized: false }
    : false,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL connected successfully.");
    
    // 1. Create users table if it does not exist (including name)
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL DEFAULT '',
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'Buyer',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createUsersTableQuery);

    // 2. Ensure name column exists in case the table was created earlier without it
    const alterUsersTableQuery = `
      ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255) NOT NULL DEFAULT '';
    `;
    await client.query(alterUsersTableQuery);
    console.log("Table 'users' verified/updated.");

    // 3. Create sellers table
    const createSellersTableQuery = `
      CREATE TABLE IF NOT EXISTS sellers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        shop_name VARCHAR(255) DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createSellersTableQuery);
    console.log("Table 'sellers' verified/created.");

    // 4. Create buyers table
    const createBuyersTableQuery = `
      CREATE TABLE IF NOT EXISTS buyers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        address TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createBuyersTableQuery);
    console.log("Table 'buyers' verified/created.");

    client.release();
  } catch (error) {
    console.error(`PostgreSQL Connection/Migration Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  pool,
};
