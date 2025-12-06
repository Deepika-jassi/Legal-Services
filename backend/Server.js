// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// --- Ensure uploads folder exists (for verification ID uploads) ---
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ------------------
// Keep your existing mock routes (unchanged)
// ------------------

// Mock auth routes
app.post("/api/auth/login", (req, res) => {
  res.json({ message: "Login successful (mock)" });
});

app.post("/api/auth/register", (req, res) => {
  res.json({ message: "User registered (mock)" });
});

// Mock listings
app.get("/api/listings", (req, res) => {
  res.json([
    { id: 1, title: "Contract Drafting", description: "Draft contracts for businesses" },
    { id: 2, title: "Legal Consultation", description: "30-min consultation with a lawyer" }
  ]);
});

// Mock documents upload (keeps existing behavior)
app.post("/api/documents/upload", (req, res) => {
  const { filename, owner } = req.body;
  res.json({ message: "Document uploaded", document: { id: Date.now(), filename, owner } });
});

// (keep any other existing mock routes you had here…)

// ------------------
// Mount modular route files (lawyer, verification, etc.)
// ------------------

// mount lawyer routes (keep your existing file at backend/routes/lawyer.js)
try {
  const lawyerRoutes = require("./routes/lawyer");
  app.use("/api/lawyer", lawyerRoutes);
} catch (err) {
  console.warn("Warning: ./routes/lawyer not found or failed to load. Skipping lawyer routes.", err.message);
}

// mount verification routes (ensure backend/routes/verification.js exists)
try {
  const verificationRoutes = require("./routes/verification");
  app.use("/api/verification", verificationRoutes);
} catch (err) {
  console.warn("Warning: ./routes/verification not found or failed to load. Skipping verification routes.", err.message);
}

// Serve uploaded files (demo only) so frontend can preview IDs: http://localhost:5000/uploads/<filename>
app.use("/uploads", express.static(uploadsDir));

// ------------------
// Start server
// ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
