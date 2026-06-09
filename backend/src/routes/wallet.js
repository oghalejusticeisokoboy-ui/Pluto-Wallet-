const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Wallet = require('../models/Wallet');
const { ethers } = require('ethers');

// Create wallet
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { walletName, blockchain } = req.body;

    // Generate new wallet
    const wallet = ethers.Wallet.createRandom();

    // Create wallet document (note: DO NOT store unencrypted private key in production)
    const newWallet = new Wallet({
      userId: req.userId,
      walletAddress: wallet.address,
      walletName: walletName || 'My Wallet',
      blockchain: blockchain || 'ethereum',
      balance: 0
    });

    await newWallet.save();

    res.status(201).json({
      message: 'Wallet created successfully',
      wallet: {
        id: newWallet._id,
        address: newWallet.walletAddress,
        name: newWallet.walletName,
        blockchain: newWallet.blockchain
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all wallets
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const wallets = await Wallet.find({ userId: req.userId });
    res.json({ wallets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get wallet details
router.get('/:walletId', authMiddleware, async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.walletId);
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json({ wallet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
