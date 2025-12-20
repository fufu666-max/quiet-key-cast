"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useChainId } from "wagmi";
import { useFhevm } from "../fhevm/useFhevm";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useFHECounterWagmi } from "@/hooks/useFHECounterWagmi";
import { ErrorNotDeployed } from "./ErrorNotDeployed";
import { DecryptionReveal } from "./DecryptionReveal";
import { AnimatedCard } from "./PageTransition";
import {
  RefreshCw,
  Lock,
  Unlock,
  Plus,
  Minus,
  Zap,
  Shield,
  Activity,
  CheckCircle2,
  XCircle,
  Loader2,
  Wallet,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";

export const FHECounterDemo = () => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const [showDecryptReveal, setShowDecryptReveal] = useState(false);
  const [revealedValue, setRevealedValue] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const provider = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return window.ethereum;
  }, []);

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider: isConnected ? provider : undefined,
    chainId: isConnected ? chainId : undefined,
    initialMockChains: { 31337: "http://localhost:8545" },
    enabled: isConnected,
  });

  const fheCounter = useFHECounterWagmi({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    chainId,
  });

  useEffect(() => {
    console.log(
      `[Debug] connected=${isConnected}, chainId=${chainId}, fhevmStatus=${fhevmStatus}, instance=${!!fhevmInstance}, contract=${fheCounter.contractAddress}, canIncOrDec=${fheCounter.canIncOrDec}, msg=${fheCounter.message}`,
    );
  }, [
    isConnected,
    chainId,
    fhevmStatus,
    fhevmInstance,
    fheCounter.contractAddress,
    fheCounter.canIncOrDec,
    fheCounter.message,
  ]);

  const handleDecrypt = async () => {
    setShowDecryptReveal(true);
    await fheCounter.decryptCountHandle();
  };

  if (fheCounter.isDecrypted && fheCounter.clear !== undefined && revealedValue !== String(fheCounter.clear)) {
    setRevealedValue(String(fheCounter.clear));
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <AnimatedCard>
          <div className="text-center">
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wallet className="w-12 h-12 text-purple-400" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">Use the button in the top right corner to connect</p>
          </div>
        </AnimatedCard>
      </div>
    );
  }

  if (fheCounter.isDeployed === false) {
    return <ErrorNotDeployed chainId={chainId} />;
  }

  return (
    <div className="space-y-6">
      <AnimatedCard delay={0}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">FHE Counter</h1>
            <p className="text-muted-foreground mt-1">Fully Homomorphic Encryption Demo</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-green-500"
            />
            <span className="text-sm text-muted-foreground">Connected</span>
          </div>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={0.1}>
        <div className="glass rounded-2xl p-8 card-hover">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Encrypted Counter</h2>
                <p className="text-sm text-muted-foreground">FHECounter.sol</p>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                fhevmStatus === "ready"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : fhevmStatus === "loading"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
              }`}
            >
              {fhevmStatus}
            </div>
          </div>

          <div className="relative bg-black/30 rounded-xl p-8 mb-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5" />
            <div className="relative text-center">
              <p className="text-sm text-muted-foreground mb-2">Current Value</p>
              <AnimatePresence mode="wait">
                {fheCounter.isDecrypted ? (
                  <motion.div
                    key="decrypted"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl font-bold gradient-text"
                  >
                    {String(fheCounter.clear)}
                  </motion.div>
                ) : (
                  <motion.div
                    key="encrypted"
                    className="flex items-center justify-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Lock className="w-8 h-8 text-purple-400" />
                    <span className="text-2xl text-muted-foreground font-mono">
                      {fheCounter.handle
                        ? `${fheCounter.handle.slice(0, 10)}...${fheCounter.handle.slice(-8)}`
                        : "Not initialized"}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.button
              onClick={handleDecrypt}
              disabled={!fheCounter.canDecrypt || fheCounter.isDecrypting}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={fheCounter.canDecrypt ? { scale: 1.02 } : {}}
              whileTap={fheCounter.canDecrypt ? { scale: 0.98 } : {}}
            >
              {fheCounter.isDecrypting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : fheCounter.isDecrypted ? (
                <Unlock className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
              <span>
                {fheCounter.isDecrypting ? "Decrypting..." : fheCounter.isDecrypted ? "Decrypted" : "Decrypt Value"}
              </span>
            </motion.button>
            <motion.button
              onClick={fheCounter.refreshCountHandle}
              disabled={!fheCounter.canGetCount || fheCounter.isRefreshing}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={fheCounter.canGetCount ? { scale: 1.02 } : {}}
              whileTap={fheCounter.canGetCount ? { scale: 0.98 } : {}}
            >
              {fheCounter.isRefreshing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              <span>{fheCounter.isRefreshing ? "Refreshing..." : "Refresh Handle"}</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              onClick={() => {
                console.log("[FHECounterDemo] Increment clicked");
                fheCounter.incOrDec(1);
              }}
              disabled={!fheCounter.canIncOrDec || fheCounter.isIncOrDec}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={fheCounter.canIncOrDec ? { scale: 1.02 } : {}}
              whileTap={fheCounter.canIncOrDec ? { scale: 0.98 } : {}}
            >
              {fheCounter.isIncOrDec ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              <span>Increment</span>
            </motion.button>
            <motion.button
              onClick={() => {
                console.log("[FHECounterDemo] Decrement clicked");
                fheCounter.incOrDec(-1);
              }}
              disabled={!fheCounter.canIncOrDec || fheCounter.isIncOrDec}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={fheCounter.canIncOrDec ? { scale: 1.02 } : {}}
              whileTap={fheCounter.canIncOrDec ? { scale: 0.98 } : {}}
            >
              {fheCounter.isIncOrDec ? <Loader2 className="w-5 h-5 animate-spin" /> : <Minus className="w-5 h-5" />}
              <span>Decrement</span>
            </motion.button>
          </div>
        </div>
      </AnimatedCard>

      <div className="grid grid-cols-2 gap-6">
        <AnimatedCard delay={0.2}>
          <div className="glass rounded-xl p-6 card-hover h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold">Chain Info</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Chain ID</span>
                <span className="font-mono text-sm">{chainId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account</span>
                <span className="font-mono text-sm">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "None"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">FHEVM Status</span>
                <span className="font-mono text-sm">{fhevmStatus}</span>
              </div>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.3}>
          <div className="glass rounded-xl p-6 card-hover h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold">Contract Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contract</span>
                <span className="font-mono text-sm">
                  {fheCounter.contractAddress
                    ? `${fheCounter.contractAddress.slice(0, 6)}...${fheCounter.contractAddress.slice(-4)}`
                    : "Not deployed"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Deployed</span>
                {fheCounter.isDeployed ? (
                  <span className="flex items-center gap-1 text-green-400">
                    <CheckCircle2 className="w-4 h-4" /> Yes
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400">
                    <XCircle className="w-4 h-4" /> No
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Can Operate</span>
                {fheCounter.canIncOrDec ? (
                  <span className="flex items-center gap-1 text-green-400">
                    <CheckCircle2 className="w-4 h-4" /> Yes
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400">
                    <XCircle className="w-4 h-4" /> No
                  </span>
                )}
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>

      <AnimatedCard delay={0.4}>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className="text-sm font-mono">{fheCounter.message || "Ready"}</span>
          </div>
        </div>
      </AnimatedCard>

      <DecryptionReveal
        isOpen={showDecryptReveal && fheCounter.isDecrypting}
        onClose={() => setShowDecryptReveal(false)}
        value={revealedValue}
        isDecrypting={fheCounter.isDecrypting}
      />
    </div>
  );
};
