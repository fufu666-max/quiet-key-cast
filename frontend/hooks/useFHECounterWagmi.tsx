"use client";

import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { FhevmInstance } from "@/fhevm/fhevmTypes";
import { FhevmDecryptionSignature } from "@/fhevm/FhevmDecryptionSignature";
import { GenericStringStorage } from "@/fhevm/GenericStringStorage";
import { FHECounterAddresses } from "@/abi/FHECounterAddresses";
import { FHECounterABI } from "@/abi/FHECounterABI";

export type ClearValueType = {
  handle: string;
  clear: string | bigint | boolean;
};

type FHECounterInfoType = {
  abi: typeof FHECounterABI.abi;
  address?: `0x${string}`;
  chainId?: number;
  chainName?: string;
};

function getFHECounterByChainId(chainId: number | undefined): FHECounterInfoType {
  if (!chainId) {
    return { abi: FHECounterABI.abi };
  }

  const entry = FHECounterAddresses[chainId.toString() as keyof typeof FHECounterAddresses];

  if (!entry || !("address" in entry) || entry.address === ethers.ZeroAddress) {
    return { abi: FHECounterABI.abi, chainId };
  }

  return {
    address: entry?.address as `0x${string}` | undefined,
    chainId: entry?.chainId ?? chainId,
    chainName: entry?.chainName,
    abi: FHECounterABI.abi,
  };
}

export const useFHECounterWagmi = (parameters: {
  instance: FhevmInstance | undefined;
  fhevmDecryptionSignatureStorage: GenericStringStorage;
  chainId: number | undefined;
}) => {
  const { instance, fhevmDecryptionSignatureStorage, chainId } = parameters;

  const { address } = useAccount();
  // walletClient 用于确保钱包已连接
  useWalletClient();

  // 创建 ethers provider 和 signer
  const ethersProvider = useMemo(() => {
    if (typeof window === "undefined" || !window.ethereum) return undefined;
    return new ethers.BrowserProvider(window.ethereum);
  }, []);

  const [ethersSigner, setEthersSigner] = useState<ethers.JsonRpcSigner | undefined>(undefined);

  // 获取 signer
  useEffect(() => {
    if (!ethersProvider || !address) {
      setEthersSigner(undefined);
      return;
    }

    ethersProvider
      .getSigner(address)
      .then(setEthersSigner)
      .catch(() => setEthersSigner(undefined));
  }, [ethersProvider, address]);

  const [countHandle, setCountHandle] = useState<string | undefined>(undefined);
  const [clearCount, setClearCount] = useState<ClearValueType | undefined>(undefined);
  const clearCountRef = useRef<ClearValueType | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [isIncOrDec, setIsIncOrDec] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const fheCounterRef = useRef<FHECounterInfoType | undefined>(undefined);
  const isRefreshingRef = useRef<boolean>(isRefreshing);
  const isDecryptingRef = useRef<boolean>(isDecrypting);
  const isIncOrDecRef = useRef<boolean>(isIncOrDec);
  const chainIdRef = useRef<number | undefined>(chainId);
  const signerRef = useRef<ethers.JsonRpcSigner | undefined>(ethersSigner);

  // 更新 refs
  useEffect(() => {
    chainIdRef.current = chainId;
  }, [chainId]);

  useEffect(() => {
    signerRef.current = ethersSigner;
  }, [ethersSigner]);

  const isDecrypted = countHandle && countHandle === clearCount?.handle;

  const fheCounter = useMemo(() => {
    const c = getFHECounterByChainId(chainId);
    fheCounterRef.current = c;

    if (!c.address) {
      setMessage(`FHECounter deployment not found for chainId=${chainId}.`);
    }

    return c;
  }, [chainId]);

  const isDeployed = useMemo(() => {
    if (!fheCounter) return undefined;
    return Boolean(fheCounter.address) && fheCounter.address !== ethers.ZeroAddress;
  }, [fheCounter]);

  const canGetCount = useMemo(() => {
    return fheCounter.address && ethersProvider && !isRefreshing;
  }, [fheCounter.address, ethersProvider, isRefreshing]);

  // 刷新 count handle
  const refreshCountHandle = useCallback(() => {
    console.log("[useFHECounterWagmi] call refreshCountHandle()");
    if (isRefreshingRef.current) return;

    if (!fheCounterRef.current?.chainId || !fheCounterRef.current?.address || !ethersProvider) {
      setCountHandle(undefined);
      return;
    }

    isRefreshingRef.current = true;
    setIsRefreshing(true);

    const thisChainId = fheCounterRef.current.chainId;
    const thisFheCounterAddress = fheCounterRef.current.address;

    const thisFheCounterContract = new ethers.Contract(
      thisFheCounterAddress,
      fheCounterRef.current.abi,
      ethersProvider,
    );

    thisFheCounterContract
      .getCount()
      .then((value: string) => {
        console.log("[useFHECounterWagmi] getCount()=" + value);
        if (chainIdRef.current === thisChainId && thisFheCounterAddress === fheCounterRef.current?.address) {
          setCountHandle(value);
        }
        isRefreshingRef.current = false;
        setIsRefreshing(false);
      })
      .catch((e: Error) => {
        setMessage("FHECounter.getCount() call failed! error=" + e);
        isRefreshingRef.current = false;
        setIsRefreshing(false);
      });
  }, [ethersProvider]);

  // 自动刷新
  useEffect(() => {
    refreshCountHandle();
  }, [refreshCountHandle]);

  const canDecrypt = useMemo(() => {
    return (
      fheCounter.address &&
      instance &&
      ethersSigner &&
      !isRefreshing &&
      !isDecrypting &&
      countHandle &&
      countHandle !== ethers.ZeroHash &&
      countHandle !== clearCount?.handle
    );
  }, [fheCounter.address, instance, ethersSigner, isRefreshing, isDecrypting, countHandle, clearCount]);

  // 解密
  const decryptCountHandle = useCallback(() => {
    if (isRefreshingRef.current || isDecryptingRef.current) return;
    if (!fheCounter.address || !instance || !ethersSigner) return;

    if (countHandle === clearCountRef.current?.handle) return;

    if (!countHandle) {
      setClearCount(undefined);
      clearCountRef.current = undefined;
      return;
    }

    if (countHandle === ethers.ZeroHash) {
      setClearCount({ handle: countHandle, clear: BigInt(0) });
      clearCountRef.current = { handle: countHandle, clear: BigInt(0) };
      return;
    }

    const thisChainId = chainId;
    const thisFheCounterAddress = fheCounter.address;
    const thisCountHandle = countHandle;
    const thisEthersSigner = ethersSigner;

    isDecryptingRef.current = true;
    setIsDecrypting(true);
    setMessage("Start decrypt...");

    const run = async () => {
      const isStale = () =>
        thisFheCounterAddress !== fheCounterRef.current?.address ||
        chainIdRef.current !== thisChainId ||
        signerRef.current !== thisEthersSigner;

      try {
        setMessage("Building FHEVM decryption signature...");

        const sig = await FhevmDecryptionSignature.loadOrSign(
          instance,
          [fheCounter.address as `0x${string}`],
          ethersSigner,
          fhevmDecryptionSignatureStorage,
        );

        if (!sig) {
          setMessage("Unable to build FHEVM decryption signature");
          return;
        }

        if (isStale()) {
          setMessage("Ignore FHEVM decryption (stale)");
          return;
        }

        setMessage("Call FHEVM userDecrypt...");

        const res = await instance.userDecrypt(
          [{ handle: thisCountHandle, contractAddress: thisFheCounterAddress }],
          sig.privateKey,
          sig.publicKey,
          sig.signature,
          sig.contractAddresses,
          sig.userAddress,
          sig.startTimestamp,
          sig.durationDays,
        );

        setMessage("FHEVM userDecrypt completed!");

        if (isStale()) {
          setMessage("Ignore FHEVM decryption (stale)");
          return;
        }

        setClearCount({ handle: thisCountHandle, clear: res[thisCountHandle] });
        clearCountRef.current = { handle: thisCountHandle, clear: res[thisCountHandle] };

        setMessage("Decrypted value: " + clearCountRef.current.clear);
      } catch (e) {
        setMessage("Decryption failed: " + e);
      } finally {
        isDecryptingRef.current = false;
        setIsDecrypting(false);
      }
    };

    run();
  }, [fhevmDecryptionSignatureStorage, ethersSigner, fheCounter.address, instance, countHandle, chainId]);

  const canIncOrDec = useMemo(() => {
    return fheCounter.address && instance && ethersSigner && !isRefreshing && !isIncOrDec;
  }, [fheCounter.address, instance, ethersSigner, isRefreshing, isIncOrDec]);

  // 加密并调用 increment/decrement
  const incOrDec = useCallback(
    (value: number) => {
      if (isRefreshingRef.current || isIncOrDecRef.current) return;
      if (!fheCounter.address || !instance || !ethersSigner || value === 0) return;

      const thisChainId = chainId;
      const thisFheCounterAddress = fheCounter.address;
      const thisEthersSigner = ethersSigner;
      const thisFheCounterContract = new ethers.Contract(thisFheCounterAddress, fheCounter.abi, thisEthersSigner);

      const op = value > 0 ? "increment" : "decrement";
      const valueAbs = Math.abs(value);
      const opMsg = `${op}(${valueAbs})`;

      isIncOrDecRef.current = true;
      setIsIncOrDec(true);
      setMessage(`Start ${opMsg}...`);

      const run = async () => {
        // 让浏览器重绘
        await new Promise((resolve) => setTimeout(resolve, 100));

        const isStale = () =>
          thisFheCounterAddress !== fheCounterRef.current?.address ||
          chainIdRef.current !== thisChainId ||
          signerRef.current !== thisEthersSigner;

        try {
          setMessage(`Encrypting value ${valueAbs}...`);

          const input = instance.createEncryptedInput(thisFheCounterAddress, thisEthersSigner.address);
          input.add32(valueAbs);

          // FHE 加密 (CPU 密集型)
          const enc = await input.encrypt();

          if (isStale()) {
            setMessage(`Ignore ${opMsg} (stale)`);
            return;
          }

          setMessage(`Calling ${opMsg} on contract...`);

          // 调用合约
          const tx: ethers.TransactionResponse =
            op === "increment"
              ? await thisFheCounterContract.increment(enc.handles[0], enc.inputProof)
              : await thisFheCounterContract.decrement(enc.handles[0], enc.inputProof);

          setMessage(`Waiting for tx: ${tx.hash.slice(0, 10)}...`);

          const receipt = await tx.wait();

          setMessage(`${opMsg} completed! Status: ${receipt?.status === 1 ? "Success" : "Failed"}`);

          if (isStale()) {
            setMessage(`Ignore ${opMsg} (stale)`);
            return;
          }

          // 刷新 handle
          refreshCountHandle();
        } catch (e) {
          setMessage(`${opMsg} Failed: ${e}`);
        } finally {
          isIncOrDecRef.current = false;
          setIsIncOrDec(false);
        }
      };

      run();
    },
    [ethersSigner, fheCounter.address, fheCounter.abi, instance, chainId, refreshCountHandle],
  );

  return {
    contractAddress: fheCounter.address,
    canDecrypt,
    canGetCount,
    canIncOrDec,
    incOrDec,
    decryptCountHandle,
    refreshCountHandle,
    isDecrypted,
    message,
    clear: clearCount?.clear,
    handle: countHandle,
    isDecrypting,
    isRefreshing,
    isIncOrDec,
    isDeployed,
  };
};
