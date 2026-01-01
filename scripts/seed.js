require('dotenv').config(); // load .env variables
const mongoose = require('mongoose');
const Expense = require('../models/expense');

// Use env variable or fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';

// Sample expenses
const sampleExpenses = [
  { title: 'Coffee', amount: 150, category: 'Food', date: new Date('2025-10-10'), note: 'Starbucks' },
  { title: 'Bus Ticket', amount: 50, category: 'Travel', date: new Date('2025-10-11'), note: 'Local bus' },
  { title: 'Electricity Bill', amount: 1200, category: 'Bills', date: new Date('2025-10-05') },
  { title: 'Doctor Visit', amount: 500, category: 'Health', date: new Date('2025-10-08') },
  { title: 'Movie', amount: 300, category: 'Other', date: new Date('2025-10-09'), note: 'Cinema' }
];

// Connect to MongoDB and insert sample expenses
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to DB');
    await Expense.insertMany(sampleExpenses);
    console.log('✅ 5 Sample expenses inserted');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    mongoose.disconnect();
  });
