import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string | null;
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  chainId: null,
  balance: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletAddress: (state, action: PayloadAction<string | null>) => {
      state.address = action.payload;
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setChainId: (state, action: PayloadAction<number | null>) => {
      state.chainId = action.payload;
    },
    setBalance: (state, action: PayloadAction<string | null>) => {
      state.balance = action.payload;
    },
    updateWalletState: (state, action: PayloadAction<Partial<WalletState>>) => {
      Object.assign(state, action.payload);
    },
    disconnectWallet: (state) => {
      state.address = null;
      state.isConnected = false;
      state.chainId = null;
      state.balance = null;
    },
  },
});

export const {
  setWalletAddress,
  setConnectionStatus,
  setChainId,
  setBalance,
  disconnectWallet,
} = walletSlice.actions;

export default walletSlice.reducer;
