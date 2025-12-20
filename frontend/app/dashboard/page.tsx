"use client";

import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/PageTransition";
import { DashboardStats } from "@/components/DashboardStats";
import { ActivityChart } from "@/components/ActivityChart";
import { RecentTransactions } from "@/components/RecentTransactions";
import { NetworkStatus } from "@/components/NetworkStatus";
import { useAccount } from "wagmi";
import { useFhevm } from "@/fhevm/useFhevm";
import { useDashboardDataWagmi } from "@/hooks/useDashboardDataWagmi";
import { Wallet, FileCode, Clock, Blocks } from "lucide-react";
import { useMemo } from "react";

export default function DashboardPage() {
  const { address, isConnected, chainId } = useAccount();

  const provider = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return window.ethereum;
  }, []);

  const { status: fhevmStatus } = useFhevm({
    provider: isConnected ? provider : undefined,
    chainId: isConnected ? chainId : undefined,
    initialMockChains: { 31337: "http://localhost:8545" },
    enabled: isConnected,
  });

  const dashboardData = useDashboardDataWagmi();

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
            <p className="text-muted-foreground">Use the button in the top right corner to connect</p>
          </div>
        </AnimatedCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard delay={0}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time blockchain analytics</p>
          </div>
          <NetworkStatus chainId={chainId} fhevmStatus={fhevmStatus} account={address} />
        </div>
      </AnimatedCard>

      {/* Contract Info */}
      {dashboardData.contractAddress && (
        <AnimatedCard delay={0.05}>
          <div className="glass rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <FileCode className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">FHECounter Contract</p>
                <p className="font-mono text-sm">{dashboardData.contractAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Blocks className="w-4 h-4 text-muted-foreground" />
                <span>Block #{dashboardData.blockNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{dashboardData.avgBlockTime.toFixed(1)}s avg</span>
              </div>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Stats Grid */}
      <DashboardStats data={dashboardData} />

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        <AnimatedCard delay={0.3} className="col-span-2">
          <ActivityChart data={dashboardData.activityData} />
        </AnimatedCard>
        <AnimatedCard delay={0.4}>
          <RecentTransactions transactions={dashboardData.recentTransactions} />
        </AnimatedCard>
      </div>
    </div>
  );
}
