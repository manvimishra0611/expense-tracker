const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  amount:   { type: Number, required: true, min: 0 },
  category: { type: String, default: 'General' },
  date:     { type: Date, required: true },
  note:     { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);