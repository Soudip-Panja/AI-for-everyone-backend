const { login, refresh } = require("../controllers/auth.controller");
const verifyJWT = require("../middleware/auth.middleware");

async function authRoutes(fastify, options) {
  // Login route
  fastify.post("/login", login);

  // Refresh token route
  fastify.post("/refresh", refresh);

  // Protected route to test JWT verification
  fastify.get("/me", { preHandler: verifyJWT }, async (request, reply) => {
    return {
      message: "Authenticated successfully",
      user: request.user,
    };
  });

  // Sample protected route
  fastify.get("/dashboard", { preHandler: verifyJWT }, async (request, reply) => {
    return {
      message: "Welcome to the secure dashboard!",
      secretData: "This is top secret data visible only to authenticated users.",
      user: request.user,
    };
  });
}

module.exports = authRoutes;