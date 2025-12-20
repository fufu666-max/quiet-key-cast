"use client";

import { motion } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";

interface NetworkStatusProps {
  chainId: number | undefined;
  fhevmStatus: string;
  account: string | undefined;
}

const networkNames: Record<number, string> = {
  1: "Ethereum Mainnet",
  5: "Goerli",
  11155111: "Sepolia",
  31337: "Hardhat Local",
  137: "Polygon",
  80001: "Mumbai",
};

export function NetworkStatus({ chainId, fhevmStatus, account }: NetworkStatusProps) {
  const networkName = chainId ? networkNames[chainId] || `Chain ${chainId}` : "Not Connected";
  const isConnected = !!chainId && fhevmStatus === "ready";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4"
    >
      {account && (
        <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-muted-foreground">Account</p>
          <p className="text-sm font-mono">{`${account.slice(0, 6)}...${account.slice(-4)}`}</p>
        </div>
      )}
      
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
        <motion.div
          animate={{ scale: isConnected ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isConnected ? (
            <Wifi className="w-4 h-4 text-emerald-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
        </motion.div>
        <div>
          <p className="text-sm font-medium">{networkName}</p>
          <p className="text-xs text-muted-foreground">
            {fhevmStatus === "ready" ? "FHEVM Ready" : fhevmStatus}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
