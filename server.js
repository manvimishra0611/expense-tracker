require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

// DB
console.log("Loaded URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err.message));

// Health
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    message: 'Server OK',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'not connected'
  });
});

// Routes
const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>console.log(`💡 Server running on http://localhost:${PORT}`));


const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// 404 handler (if no route matched)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);
