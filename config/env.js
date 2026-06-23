require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/ai-for-everyone",
  JWT_SECRET: process.env.JWT_SECRET || "fallback_jwt_secret_key_12345",
  REFRESH_SECRET: process.env.REFRESH_SECRET || "fallback_refresh_token_secret_key_54321",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@example.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123",
  ADMIN_ROLE: process.env.ADMIN_ROLE || "admin",
};
