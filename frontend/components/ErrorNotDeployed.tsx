"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Terminal, ArrowRight } from "lucide-react";
import { AnimatedCard } from "./PageTransition";

interface ErrorNotDeployedProps {
  chainId: number | undefined;
}

export function ErrorNotDeployed({ chainId }: ErrorNotDeployedProps) {
  const networkName = chainId === 11155111 ? "Sepolia" : "your-network-name";

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatedCard>
        <div className="glass rounded-2xl p-8 border border-red-500/30">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              className="w-16 h-16 rounded-xl bg-red-500/20 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-red-400">Contract Not Deployed</h1>
              <p className="text-muted-foreground">
                FHECounter.sol is not available on Chain ID: {chainId}
                {chainId === 11155111 && " (Sepolia)"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4 mb-8">
            <p className="text-muted-foreground">
              The <code className="px-2 py-1 rounded bg-white/10 text-purple-400">FHECounter.sol</code> contract 
              has either not been deployed yet, or the deployment address is missing from the ABI directory.
            </p>
          </div>

          {/* Solution */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-purple-400" />
              How to Deploy
            </h3>

            <div className="bg-black/50 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-3 text-muted-foreground text-sm">
                <Terminal className="w-4 h-4" />
                <span>Run from project root:</span>
              </div>
              <code className="text-green-400 font-mono text-sm">
                npx hardhat deploy --network {networkName}
              </code>
            </div>

            <p className="text-sm text-muted-foreground">
              Alternatively, switch to the local <code className="px-2 py-1 rounded bg-white/10">Hardhat Node</code> using 
              the MetaMask browser extension.
            </p>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}
