// backend/routes/verification.js
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// simple in-memory storage of verification entries for demo
// structure: { [userId]: { status, phoneVerified, barVerified, idFile, barNumber, jurisdiction, notes } }
const store = {};

// ensure uploads folder exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, safeName);
  }
});
const upload = multer({ storage });

// helper to ensure an entry
function ensureEntry(userId) {
  if (!store[userId]) {
    store[userId] = {
      status: "incomplete",
      phoneVerified: false,
      barVerified: false,
      idFile: null,
      barNumber: null,
      jurisdiction: null,
      notes: ""
    };
  }
  return store[userId];
}

// GET status: /api/verification/status/:userId
router.get("/status/:userId", (req, res) => {
  const userId = req.params.userId;
  const entry = store[userId] || null;
  res.json({ entry });
});

// POST request OTP (demo) -> returns debug OTP
router.post("/request-otp", (req, res) => {
  const { userId, phone } = req.body || {};
  if (!userId || !phone) return res.status(400).json({ error: "userId and phone required" });

  ensureEntry(userId);
  // demo: generate a 4-digit OTP and save to entry for confirmation
  const otp = String(1000 + Math.floor(Math.random() * 9000));
  store[userId].pendingOtp = otp;
  store[userId].phone = phone;

  // In real app: send SMS via provider (Twilio etc.)
  return res.json({ message: "OTP sent (demo)", debugOtp: otp });
});

// POST confirm OTP
router.post("/confirm-otp", (req, res) => {
  const { userId, otp } = req.body || {};
  if (!userId || !otp) return res.status(400).json({ error: "userId and otp required" });

  const entry = ensureEntry(userId);
  if (entry.pendingOtp && String(entry.pendingOtp) === String(otp)) {
    entry.phoneVerified = true;
    delete entry.pendingOtp;
    // update overall status
    if (entry.phoneVerified && entry.barVerified && entry.idFile) entry.status = "verified";
    else entry.status = "partial";
    return res.json({ message: "Phone verified" });
  } else {
    return res.status(400).json({ error: "Invalid OTP" });
  }
});

// POST upload ID document (multipart/form-data)
router.post("/upload-id", upload.single("file"), (req, res) => {
  const userId = req.body.userId || (req.query && req.query.userId);
  if (!userId) return res.status(400).json({ error: "userId required" });
  if (!req.file) return res.status(400).json({ error: "file required" });

  const entry = ensureEntry(userId);
  entry.idFile = `/uploads/${req.file.filename}`;
  // naive: mark partial verification step done
  if (entry.phoneVerified && entry.barVerified) entry.status = "verified";
  else entry.status = "partial";
  return res.json({ message: "ID uploaded", path: entry.idFile });
});

// POST submit professional credentials
router.post("/submit-credentials", (req, res) => {
  const { userId, barNumber, jurisdiction, practiceAreas } = req.body || {};
  if (!userId || !barNumber) return res.status(400).json({ error: "userId and barNumber required" });

  const entry = ensureEntry(userId);
  entry.barNumber = barNumber;
  entry.jurisdiction = jurisdiction || "";
  entry.practiceAreas = practiceAreas || [];

  // demo auto-verify rule: if barNumber startsWith "VALID" -> mark barVerified true
  if (String(barNumber).startsWith("VALID")) {
    entry.barVerified = true;
  } else {
    entry.barVerified = false;
    entry.notes = "Manual review required";
  }

  if (entry.phoneVerified && entry.barVerified && entry.idFile) entry.status = "verified";
  else entry.status = entry.barVerified ? "partial" : "needs_review";

  return res.json({ message: "Credentials recorded", entry });
});

// For admin: list all verifications (very simple)
router.get("/all", (req, res) => {
  res.json({ items: store });
});

module.exports = router;
