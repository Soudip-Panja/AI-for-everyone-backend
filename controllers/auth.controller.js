const jwt = require("jsonwebtoken");
const { JWT_SECRET, REFRESH_SECRET } = require("../config/env");
const User = require("../models/users.model");

const login = async (request, reply) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.code(400).send({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    if (user.password !== password) {
      return reply.code(401).send({ message: "Invalid credentials" });
    }

    // Access Token (Expires in 24 hours)
    const token = jwt.sign(
      {
        role: user.role,
        email: user.email,
        userId: user._id,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Refresh Token (Expires in 7 days / 1 week)
    const refreshToken = jwt.sign(
      {
        role: user.role,
        email: user.email,
        userId: user._id,
        name: user.name,
      },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return reply.send({
      token,
      refreshToken,
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return reply.code(500).send({ message: error.message });
  }
};

const refresh = async (request, reply) => {
  try {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      return reply.code(400).send({ message: "Refresh token is required" });
    }

    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

      // Generate new access token
      const token = jwt.sign(
        {
          role: decoded.role,
          email: decoded.email,
          userId: decoded.userId,
          name: decoded.name,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Generate new refresh token
      const newRefreshToken = jwt.sign(
        {
          role: decoded.role,
          email: decoded.email,
          userId: decoded.userId,
          name: decoded.name,
        },
        REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      return reply.send({
        token,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      return reply.code(403).send({ message: "Invalid or expired refresh token" });
    }
  } catch (error) {
    return reply.code(500).send({ message: error.message });
  }
};

module.exports = {
  login,
  refresh,
};
