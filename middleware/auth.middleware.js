const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const verifyJWT = async (request, reply) => {
  const authHeader = request.headers["authorization"];

  if (!authHeader) {
    reply.code(401).send({ message: "No token provided" });
    return;
  }

  try {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const decodedToken = jwt.verify(token, JWT_SECRET);

    request.user = decodedToken;
  } catch (error) {
    reply.code(403).send({ message: "Invalid Token" });
    return;
  }
};

module.exports = verifyJWT;
