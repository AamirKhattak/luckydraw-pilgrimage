// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const drawRoutes = require("./routes/draw");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Lucky Draw Backend is running ✅");
});

// API Routes
app.use("/api", drawRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
});
