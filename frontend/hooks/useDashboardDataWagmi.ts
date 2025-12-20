"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, usePublicClient, useBlockNumber } from "wagmi";
import { formatEther } from "viem";
import { FHECounterAddresses } from "@/abi/FHECounterAddresses";

export interface Transaction {
  hash: string;
  type: "increment" | "decrement" | "decrypt" | "deploy" | "other";
  timestamp: number;
  status: "success" | "pending" | "failed";
  from: string;
  gasUsed: string;
  blockNumber: number;
}

export interface ActivityDataPoint {
  time: string;
  operations: number;
  encryptions: number;
  decryptions: number;
}

export interface DashboardData {
  totalOperations: number;
  totalEncryptions: number;
  totalDecryptions: number;
  totalGasUsed: bigint;
  blockNumber: number;
  networkLatency: number;
  contractBalance: string;
  accountBalance: string;
  recentTransactions: Transaction[];
  activityData: ActivityDataPoint[];
  isLoading: boolean;
  contractAddress: string | null;
  totalBlocks: number;
  avgBlockTime: number;
}

export function useDashboardDataWagmi(): DashboardData {
  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { data: currentBlockNumber } = useBlockNumber({ watch: true });

  const [data, setData] = useState<DashboardData>({
    totalOperations: 0,
    totalEncryptions: 0,
    totalDecryptions: 0,
    totalGasUsed: BigInt(0),
    blockNumber: 0,
    networkLatency: 0,
    contractBalance: "0",
    accountBalance: "0",
    recentTransactions: [],
    activityData: [],
    isLoading: true,
    contractAddress: null,
    totalBlocks: 0,
    avgBlockTime: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    if (!publicClient || !chainId) return;

    try {
      const startTime = Date.now();

      // 获取合约地址
      const entry = FHECounterAddresses[chainId.toString() as keyof typeof FHECounterAddresses];
      const contractAddress = entry && "address" in entry ? (entry.address as `0x${string}`) : null;

      const blockNum = currentBlockNumber ? Number(currentBlockNumber) : 0;
      const networkLatency = Date.now() - startTime;

      // 获取合约余额
      let contractBalance = "0";
      if (contractAddress && contractAddress !== "0x0000000000000000000000000000000000000000") {
        try {
          const balance = await publicClient.getBalance({ address: contractAddress });
          contractBalance = formatEther(balance);
        } catch {
          contractBalance = "0";
        }
      }

      // 获取用户账户余额
      let accountBalance = "0";
      if (address) {
        try {
          const balance = await publicClient.getBalance({ address });
          accountBalance = formatEther(balance);
        } catch {
          accountBalance = "0";
        }
      }

      // 获取真实交易历史
      const recentTransactions: Transaction[] = [];
      let totalGasUsed = BigInt(0);
      let incrementCount = 0;
      let decrementCount = 0;

      if (contractAddress && blockNum > 0) {
        // 扫描最近的区块获取合约交易
        const blocksToScan = Math.min(100, blockNum);
        const startBlock = Math.max(0, blockNum - blocksToScan);

        try {
          // 获取合约相关的日志/交易
          for (let i = blockNum; i > startBlock && recentTransactions.length < 20; i--) {
            const block = await publicClient.getBlock({ blockNumber: BigInt(i), includeTransactions: true });

            if (block && block.transactions) {
              for (const tx of block.transactions) {
                if (typeof tx === "object" && tx.to?.toLowerCase() === contractAddress.toLowerCase()) {
                  const receipt = await publicClient.getTransactionReceipt({ hash: tx.hash });

                  // 解析交易类型
                  let txType: Transaction["type"] = "other";
                  if (tx.input && tx.input.length >= 10) {
                    const selector = tx.input.slice(0, 10);
                    // increment 和 decrement 的函数选择器
                    if (selector === "0x7cf5dab0" || tx.input.includes("increment")) {
                      txType = "increment";
                      incrementCount++;
                    } else if (selector === "0x2baeceb7" || tx.input.includes("decrement")) {
                      txType = "decrement";
                      decrementCount++;
                    }
                  }

                  const gasUsed = receipt?.gasUsed || BigInt(0);
                  totalGasUsed += gasUsed;

                  recentTransactions.push({
                    hash: tx.hash,
                    type: txType,
                    timestamp: Number(block.timestamp),
                    status: receipt?.status === "success" ? "success" : "failed",
                    from: tx.from,
                    gasUsed: gasUsed.toString(),
                    blockNumber: Number(block.number),
                  });
                }
              }
            }
          }
        } catch (e) {
          console.log("Error scanning blocks:", e);
        }
      }

      // 计算平均出块时间
      let avgBlockTime = 0;
      if (blockNum > 1) {
        try {
          const latestBlock = await publicClient.getBlock({ blockNumber: BigInt(blockNum) });
          const olderBlock = await publicClient.getBlock({ blockNumber: BigInt(Math.max(0, blockNum - 10)) });
          if (latestBlock && olderBlock) {
            const timeDiff = Number(latestBlock.timestamp) - Number(olderBlock.timestamp);
            const blockDiff = blockNum - Math.max(0, blockNum - 10);
            avgBlockTime = blockDiff > 0 ? timeDiff / blockDiff : 0;
          }
        } catch {
          avgBlockTime = 0;
        }
      }

      // 生成活动数据（基于真实交易）
      const activityData = generateActivityFromTransactions(recentTransactions);

      setData({
        totalOperations: recentTransactions.length,
        totalEncryptions: incrementCount + decrementCount,
        totalDecryptions: 0, // 需要从日志中解析
        totalGasUsed,
        blockNumber: blockNum,
        networkLatency,
        contractBalance,
        accountBalance,
        recentTransactions,
        activityData,
        isLoading: false,
        contractAddress,
        totalBlocks: blockNum,
        avgBlockTime,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setData((prev) => ({ ...prev, isLoading: false }));
    }
  }, [publicClient, chainId, currentBlockNumber, address]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // 每 10 秒刷新一次
  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  return data;
}

function generateActivityFromTransactions(transactions: Transaction[]): ActivityDataPoint[] {
  const data: ActivityDataPoint[] = [];
  const now = Math.floor(Date.now() / 1000);

  // 按小时分组交易
  const hourlyData: Record<string, { operations: number; encryptions: number; decryptions: number }> = {};

  // 初始化最近24小时
  for (let i = 23; i >= 0; i--) {
    const hour = new Date((now - i * 3600) * 1000).getHours();
    const key = `${hour.toString().padStart(2, "0")}:00`;
    hourlyData[key] = { operations: 0, encryptions: 0, decryptions: 0 };
  }

  // 统计交易
  for (const tx of transactions) {
    const txHour = new Date(tx.timestamp * 1000).getHours();
    const key = `${txHour.toString().padStart(2, "0")}:00`;

    if (hourlyData[key]) {
      hourlyData[key].operations++;
      if (tx.type === "increment" || tx.type === "decrement") {
        hourlyData[key].encryptions++;
      }
      if (tx.type === "decrypt") {
        hourlyData[key].decryptions++;
      }
    }
  }

  // 转换为数组
  for (let i = 23; i >= 0; i--) {
    const hour = new Date((now - i * 3600) * 1000).getHours();
    const key = `${hour.toString().padStart(2, "0")}:00`;
    data.push({
      time: key,
      ...hourlyData[key],
    });
  }

  return data;
}
