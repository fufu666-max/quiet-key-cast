"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { mainnet, sepolia, hardhat } from "wagmi/chains";

// Custom local hardhat chain
const localHardhat = {
  ...hardhat,
  id: 31337,
  name: "Hardhat Local",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://localhost:8545"] },
  },
} as const;

export const config = getDefaultConfig({
  appName: "FHE Crypto Dashboard",
  // Use a valid WalletConnect project ID or get one from https://cloud.walletconnect.com
  // For local development without WalletConnect, this can be any string
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "fhe-crypto-demo",
  chains: [localHardhat, sepolia, mainnet],
  transports: {
    [localHardhat.id]: http("http://localhost:8545"),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
});
