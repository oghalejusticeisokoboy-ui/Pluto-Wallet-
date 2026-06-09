const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Send transaction
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { fromWallet, toAddress, amount, currency } = req.body;

    // Validate inputs
    if (!toAddress || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create transaction record
    const transaction = new Transaction({
      userId: req.userId,
      fromWallet,
      toAddress,
      amount,
      currency: currency || 'ETH',
      status: 'pending'
    });

    await transaction.save();

    res.status(201).json({
      message: 'Transaction initiated',
      transaction: {
        id: transaction._id,
        status: transaction.status,
        amount: transaction.amount
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transaction history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
