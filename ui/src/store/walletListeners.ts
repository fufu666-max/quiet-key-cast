import { watchAccount, watchNetwork, watchBlockNumber } from '@wagmi/core';
import { config } from '../config/wagmi';
import { store } from './index';
import { updateWalletState, disconnectWallet } from './walletSlice';

// Enhanced wallet event listeners with better error handling and state sync
export const setupWalletListeners = () => {
  let isUpdating = false; // Prevent concurrent updates

  // Listen to account changes with debouncing
  const unwatchAccount = watchAccount(config, {
    onChange(account, prevAccount) {
      if (isUpdating) return;
      isUpdating = true;

      try {
        // Check if this is a meaningful state change
        const hasChanged =
          account.address !== prevAccount?.address ||
          account.isConnected !== prevAccount?.isConnected;

        if (hasChanged) {
          store.dispatch(updateWalletState({
            address: account.address || null,
            isConnected: account.isConnected,
          }));

          // Handle disconnection
          if (!account.isConnected && prevAccount?.isConnected) {
            store.dispatch(disconnectWallet());
          }
        }
      } catch (error) {
        console.error('Error updating wallet account state:', error);
      } finally {
        isUpdating = false;
      }
    },
  });

  // Listen to network changes
  const unwatchNetwork = watchNetwork(config, {
    onChange(network, prevNetwork) {
      if (isUpdating) return;
      isUpdating = true;

      try {
        if (network.chain?.id !== prevNetwork?.chain?.id) {
          store.dispatch(updateWalletState({
            chainId: network.chain?.id || null,
          }));
        }
      } catch (error) {
        console.error('Error updating network state:', error);
      } finally {
        isUpdating = false;
      }
    },
  });

  // Listen to block changes for balance updates (optional enhancement)
  const unwatchBlock = watchBlockNumber(config, {
    onBlockNumber(blockNumber) {
      // Could trigger balance updates here if needed
      console.debug('Block number changed:', blockNumber);
    },
  });

  // Return cleanup function
  return () => {
    unwatchAccount();
    unwatchNetwork();
    unwatchBlock();
  };
};
