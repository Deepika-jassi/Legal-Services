// backend/middleware/adminOnly.js
module.exports = (req, res, next) => {
  // Demo guard: check header x-user-role === 'admin'
  const role = req.headers["x-user-role"] || (req.body && req.body.role);
  if (role === "admin") return next();
  return res.status(403).json({ error: "admin required (demo guard)" });
};
