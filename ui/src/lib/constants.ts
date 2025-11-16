/**
 * Application constants and configuration values
 */

// Election configuration
export const ELECTION_CONFIG = {
  MIN_CANDIDATES: 2,
  MAX_CANDIDATES: 10,
  MIN_DURATION_HOURS: 1,
  MAX_DURATION_HOURS: 168, // 1 week
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_CANDIDATE_NAME_LENGTH: 50
} as const;

// FHEVM configuration
export const FHEVM_CONFIG = {
  RELAYER_URL: 'https://relayer.fhevm.zama.ai',
  LOCAL_NETWORK_ID: 31337,
  SEPOLIA_NETWORK_ID: 11155111,
  SUPPORTED_NETWORKS: [31337, 11155111, 1, 137] as const
} as const;

// UI configuration
export const UI_CONFIG = {
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  POLLING_INTERVAL: 30000, // 30 seconds
  ANIMATION_DURATION: 200
} as const;

// Storage keys
export const STORAGE_KEYS = {
  WALLET_CONNECTION: 'wallet_connected',
  USER_PREFERENCES: 'user_preferences',
  ELECTION_FILTERS: 'election_filters'
} as const;

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  NETWORK_NOT_SUPPORTED: 'This network is not supported',
  CONTRACT_NOT_DEPLOYED: 'Contract not deployed on this network',
  ENCRYPTION_NOT_READY: 'Encryption service is not ready',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  INVALID_INPUT: 'Please check your input and try again'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  ELECTION_CREATED: 'Election created successfully!',
  VOTE_CAST: 'Vote cast successfully!',
  ELECTION_ENDED: 'Election ended successfully!',
  RESULTS_DECRYPTED: 'Results decrypted successfully!'
} as const;

// Time constants (in milliseconds)
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000
} as const;
