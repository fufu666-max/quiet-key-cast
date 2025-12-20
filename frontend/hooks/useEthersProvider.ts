"use client";

import { useMemo } from "react";
import { useAccount } from "wagmi";

// 简化版本 - 直接返回 window.ethereum 作为 EIP-1193 provider
export function useEthersProvider() {
  const { isConnected } = useAccount();

  return useMemo(() => {
    if (!isConnected) return undefined;
    if (typeof window === "undefined") return undefined;
    if (!window.ethereum) return undefined;

    return window.ethereum;
  }, [isConnected]);
}
