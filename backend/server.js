// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swapRoutes = require("./routes/swapRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/swaps", swapRoutes);

// ✅ Import your routes
const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes"); // even if empty for now
// const swapRoutes = require("./routes/swapRoutes"); // even if empty

// ✅ Use the routes
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/swaps", swapRoutes);

// Root route (optional)
app.get("/", (req, res) => {
  res.send("🚀 SkillLink Backend API is running");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
