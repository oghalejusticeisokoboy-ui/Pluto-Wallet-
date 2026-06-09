const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },
  walletName: String,
  privateKeyEncrypted: String, // AES encrypted
  balance: {
    type: Number,
    default: 0
  },
  blockchain: {
    type: String,
    enum: ['ethereum', 'polygon', 'bitcoin', 'binance'],
    default: 'ethereum'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Wallet', walletSchema);
