require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const expenseRoutes = require("./routes/expenseRoutes");
app.use("/api/expenses", expenseRoutes);

// Health route
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Server OK",
    db: mongoose.connection.readyState === 1 ? "connected" : "not connected",
  });
});

const PORT = process.env.PORT || 3000;

// 🔥 IMPORTANT PART
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
