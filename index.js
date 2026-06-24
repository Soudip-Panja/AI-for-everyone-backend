const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const { PORT } = require("./config/env");
const { connectDB } = require("./db/connection");
const runSeeder = require("./seedData/main.seed");
const authRoutes = require("./routes/auth.routes");

// Register CORS
fastify.register(cors, {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
});

// Register Auth Routes
fastify.register(authRoutes, { prefix: "/api/auth" });

// Global Error Handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.code(error.statusCode || 500).send({
    error: error.name || "InternalServerError",
    message: error.message || "Something went wrong on the server",
  });
});

const start = async () => {
  try {
    await connectDB();
    await fastify.listen({ port: parseInt(PORT, 10), host: "0.0.0.0" });
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// ==========================================
// DATABASE SEEDING
// To seed the database, uncomment the line below:
// connectDB().then(() => runSeeder());
// ==========================================

start();
