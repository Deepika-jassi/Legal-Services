// middleware/roleCheck.js

module.exports = function requireRole(role) {
  return (req, res, next) => {
    // For now we simulate role using headers (since login is mock)
    const userRole = req.headers["x-user-role"];

    if (!userRole) {
      return res.status(401).json({ error: "Missing user role" });
    }

    if (userRole !== role && userRole !== "admin") {
      return res.status(403).json({ error: "Access denied: requires " + role });
    }

    next();
  };
};
