const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromWallet: String,
  toAddress: String,
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'ETH'
  },
  transactionHash: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionType: {
    type: String,
    enum: ['send', 'receive'],
    default: 'send'
  },
  gasUsed: Number,
  gasFee: Number,
  blockchain: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

module.exports = mongoose.model('Transaction', transactionSchema);
