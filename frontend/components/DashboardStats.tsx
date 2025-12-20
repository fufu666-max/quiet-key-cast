"use client";

import { motion } from "framer-motion";
import { AnimatedCard } from "./PageTransition";
import { DashboardData } from "@/hooks/useDashboardDataWagmi";
import { Activity, Lock, Fuel, Blocks, Zap, Wallet, Loader2 } from "lucide-react";

interface DashboardStatsProps {
  data: DashboardData;
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      key: "totalOperations",
      label: "Total Transactions",
      value: data.totalOperations,
      icon: Activity,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-400",
    },
    {
      key: "totalEncryptions",
      label: "FHE Operations",
      value: data.totalEncryptions,
      icon: Lock,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/20",
      textColor: "text-blue-400",
    },
    {
      key: "blockNumber",
      label: "Current Block",
      value: data.blockNumber,
      icon: Blocks,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-400",
    },
    {
      key: "networkLatency",
      label: "Network Latency",
      value: `${data.networkLatency}ms`,
      icon: Zap,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/20",
      textColor: "text-pink-400",
    },
    {
      key: "accountBalance",
      label: "Your Balance",
      value: `${Number(data.accountBalance).toFixed(4)} ETH`,
      icon: Wallet,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/20",
      textColor: "text-emerald-400",
    },
    {
      key: "totalGasUsed",
      label: "Total Gas Used",
      value: formatGas(data.totalGasUsed),
      icon: Fuel,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-500/20",
      textColor: "text-indigo-400",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <AnimatedCard key={stat.key} delay={0.1 + index * 0.05}>
            <motion.div className="glass rounded-xl p-6 card-hover" whileHover={{ scale: 1.02 }}>
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                {data.isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
              </div>

              <div className="mt-4">
                <motion.p
                  className="text-3xl font-bold"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  {data.isLoading ? "..." : stat.value}
                </motion.p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>

              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${stat.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </div>
            </motion.div>
          </AnimatedCard>
        );
      })}
    </div>
  );
}

function formatGas(gas: bigint): string {
  const num = Number(gas);
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
