"use client";

import { motion } from "framer-motion";
import { Transaction } from "@/hooks/useDashboardDataWagmi";
import {
  ArrowUpRight,
  ArrowDownRight,
  Unlock,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Rocket,
} from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="glass rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Recent Transactions</h3>
        <span className="text-sm text-muted-foreground">{transactions.length} txs</span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {transactions.length > 0 ? (
          transactions.map((tx, index) => (
            <motion.div
              key={tx.hash}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <TransactionIcon type={tx.type} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{tx.type}</span>
                  <StatusBadge status={tx.status} />
                </div>
                <p className="text-sm text-muted-foreground truncate font-mono">
                  {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Block #{tx.blockNumber}</p>
                <p className="text-xs text-muted-foreground">{formatTimestamp(tx.timestamp)}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Rocket className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm mt-1">Try incrementing the counter!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionIcon({ type }: { type: Transaction["type"] }) {
  const config = {
    increment: { icon: ArrowUpRight, bg: "bg-emerald-500/20", color: "text-emerald-400" },
    decrement: { icon: ArrowDownRight, bg: "bg-rose-500/20", color: "text-rose-400" },
    decrypt: { icon: Unlock, bg: "bg-purple-500/20", color: "text-purple-400" },
    deploy: { icon: Rocket, bg: "bg-blue-500/20", color: "text-blue-400" },
    other: { icon: MoreHorizontal, bg: "bg-gray-500/20", color: "text-gray-400" },
  };

  const { icon: Icon, bg, color } = config[type];

  return (
    <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
  );
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const config = {
    success: { icon: CheckCircle2, color: "text-emerald-400" },
    pending: { icon: Clock, color: "text-yellow-400" },
    failed: { icon: XCircle, color: "text-red-400" },
  };

  const { icon: Icon, color } = config[status];

  return <Icon className={`w-4 h-4 ${color}`} />;
}

function formatTimestamp(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
