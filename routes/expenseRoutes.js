const router = require('express').Router();
const Expense = require('../models/expense');

// Create
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;
    const expense = await Expense.create({ title, amount, category, date, note });
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// List (optional filters: ?from=&to=&category=)
router.get('/', async (req, res) => {
  try {
    const { from, to, category } = req.query;
    const q = {};
    if (from || to) {
      q.date = {};
      if (from) q.date.$gte = new Date(from);
      if (to)   q.date.$lte = new Date(to);
    }
    if (category) q.category = category;

    const items = await Expense.find(q).sort({ date: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;