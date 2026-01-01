require('dotenv').config();
const mongoose = require('mongoose');
const Expense = require('../models/expense');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to DB');
    await Expense.deleteMany({});
    console.log('✅ All expenses deleted');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    mongoose.disconnect();
  });
