import create from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const useWalletStore = create((set) => ({
  wallets: [],
  loading: false,
  error: null,

  fetchWallets: async (token) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/wallet/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ wallets: response.data.wallets, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to fetch wallets', loading: false });
    }
  },

  createWallet: async (token, walletName, blockchain) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/api/wallet/create`,
        { walletName, blockchain },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        wallets: [...state.wallets, response.data.wallet],
        loading: false,
      }));
      return response.data.wallet;
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to create wallet', loading: false });
      return null;
    }
  },
}));

export default useWalletStore;
