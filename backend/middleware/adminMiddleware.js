const jwt = require("jsonwebtoken");
const User = require("../models/user");

/**
 * Protects admin routes - only users with role ADMIN can access.
 * Returns "Access Denied" for non-admin users.
 */
const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(403).json({ message: "Access Denied" });
      }

      if (user.role !== "ADMIN") {
        return res.status(403).json({ message: "Access Denied" });
      }

      if (user.isBlocked) {
        return res.status(403).json({ message: "Access Denied" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Access Denied" });
    }
  } else {
    return res.status(403).json({ message: "Access Denied" });
  }
};

module.exports = { protectAdmin };
