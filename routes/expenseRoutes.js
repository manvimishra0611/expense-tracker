const router = require('express').Router();
const Expense = require('../models/expense');
const { body, validationResult, param } = require('express-validator');

// Allowed categories
const ALLOWED_CATEGORIES = ['Food', 'Travel', 'Bills', 'Health', 'Other'];

/* -------------------------
   Validation Rules
------------------------- */

// POST / Create expense (all fields required)
const validateExpense = [
  body('title')
    .exists().withMessage('title is required')
    .bail()
    .isString().withMessage('title must be a string')
    .bail()
    .isLength({ max: 80 }).withMessage('title max length is 80 chars'),
  body('amount')
    .exists().withMessage('amount is required')
    .bail()
    .isFloat({ gt: 0 }).withMessage('amount must be a number greater than 0'),
  body('category')
    .exists().withMessage('category is required')
    .bail()
    .isIn(ALLOWED_CATEGORIES).withMessage(`category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`),
  body('date')
    .exists().withMessage('date is required')
    .bail()
    .isISO8601().withMessage('date must be a valid ISO 8601 date (YYYY-MM-DD)')
    .toDate(),
  body('note')
    .optional()
    .isString().withMessage('note must be a string')
];

// PUT / Update expense (all fields optional)
const validateExpenseUpdate = [
  body('title')
    .optional()
    .isString().withMessage('title must be a string')
    .isLength({ max: 80 }).withMessage('title max length is 80 chars'),
  body('amount')
    .optional()
    .isFloat({ gt: 0 }).withMessage('amount must be a number greater than 0'),
  body('category')
    .optional()
    .isIn(ALLOWED_CATEGORIES).withMessage(`category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`),
  body('date')
    .optional()
    .isISO8601().withMessage('date must be a valid ISO 8601 date (YYYY-MM-DD)')
    .toDate(),
  body('note')
    .optional()
    .isString().withMessage('note must be a string')
];

// Middleware to handle validation results
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}

/* -------------------------
   Routes
------------------------- */

// CREATE Expense
router.post('/', validateExpense, handleValidation, async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;
    const expense = await Expense.create({ title, amount, category, date, note });
    return res.status(201).json({ success: true, data: expense });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { category, from, to, search } = req.query;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || '-date';

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) query.category = category;

    if (from) {
      const fromDate = new Date(from);
      if (isNaN(fromDate)) {
        return res.status(400).json({ success: false, message: 'Invalid from date' });
      }
      query.date = { ...query.date, $gte: fromDate };
    }

    if (to) {
      const toDate = new Date(to);
      if (isNaN(toDate)) {
        return res.status(400).json({ success: false, message: 'Invalid to date' });
      }
      query.date = { ...query.date, $lte: toDate };
    }

    const total = await Expense.countDocuments(query);
    const pages = Math.ceil(total / limit) || 1;
    if (page > pages) page = pages;

    const expenses = await Expense.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: expenses,
      page,
      pages,
      total
    });
  } catch (err) {
    next(err);
  }
});


// UPDATE Expense
router.put('/:id', [
    param('id').isMongoId().withMessage('Invalid expense ID'),
    ...validateExpenseUpdate
  ], 
  handleValidation, 
  async (req, res) => {
    try {
      const { id } = req.params;
      const expense = await Expense.findById(id);
      if (!expense) {
        return res.status(404).json({ success: false, message: 'Expense not found' });
      }

      Object.assign(expense, req.body);
      await expense.save();

      res.status(200).json({ success: true, data: expense });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// DELETE Expense
router.delete('/:id', [
    param('id').isMongoId().withMessage('Invalid expense ID')
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Expense.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Expense not found' });
      }
      return res.status(200).json({ success: true, data: deleted, message: 'Expense deleted' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

module.exports = router;
