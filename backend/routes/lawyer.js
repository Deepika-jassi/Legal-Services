// backend/routes/lawyer.js
const express = require("express");
const router = express.Router();
const requireRole = require("../middleware/roleCheck");

// Mock data (in-memory)
let services = [
  { id: 1, lawyerId: "lawyer1", title: "Contract Drafting", price: 150, description: "Drafting contracts" },
];
let appointments = [
  { id: 1, lawyerId: "lawyer1", client: "Alice", datetime: "2025-12-05T10:00:00Z", status: "pending", service: "Contract Drafting", notes: "Initial request" }
];

// ----------------------------
// Create appointment (called by user/service-request)
// No requireRole here because this endpoint is called by clients.
// In production you should validate/authenticate the caller.
router.post("/create-appointment", (req, res) => {
  const { client, service, datetime, lawyerId, notes } = req.body;

  // basic validation
  if (!client || !service) {
    return res.status(400).json({ error: "client and service are required" });
  }

  const newId = appointments.length ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
  const newAppointment = {
    id: newId,
    lawyerId: lawyerId || "lawyer1",
    client,
    service,
    datetime: datetime || new Date().toISOString(),
    status: "pending",
    notes: notes || ""
  };

  appointments.push(newAppointment);

  // respond with created appointment
  return res.status(201).json({ message: "Appointment created", appointment: newAppointment });
});

// Get services for logged-in lawyer
router.get("/my-services", requireRole("lawyer"), (req, res) => {
  const uid = req.headers["x-user-id"] || "lawyer1";
  res.json(services.filter(s => s.lawyerId === uid));
});

// Create a new service (lawyer)
router.post("/service", requireRole("lawyer"), (req, res) => {
  const uid = req.headers["x-user-id"] || "lawyer1";
  const { title, price, description } = req.body;
  const newSvc = { id: services.length + 1, lawyerId: uid, title, price, description };
  services.push(newSvc);
  res.json({ message: "created", service: newSvc });
});

// Get appointments for logged-in lawyer
router.get("/appointments", requireRole("lawyer"), (req, res) => {
  const uid = req.headers["x-user-id"] || "lawyer1";
  // return appointments matching the lawyer id
  res.json(appointments.filter(a => a.lawyerId === uid));
});

// Update appointment status
router.post("/appointments/:id/status", requireRole("lawyer"), (req, res) => {
  const id = Number(req.params.id);
  const { status, rescheduleTo } = req.body;
  const ap = appointments.find(a => a.id === id);
  if (!ap) return res.status(404).json({ error: "not found" });

  // if rescheduleTo is provided, update datetime
  if (rescheduleTo) {
    ap.datetime = new Date(rescheduleTo).toISOString();
  }

  if (status) ap.status = status;
  res.json({ message: "updated", appointment: ap });
});

module.exports = router;
