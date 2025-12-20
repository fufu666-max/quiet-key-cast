"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";

export function WalletButton() {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <ConnectButton.Custom>
        {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <motion.button
                      onClick={openConnectModal}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium text-sm hover:from-purple-500 hover:to-violet-500 transition-all duration-300 shadow-lg shadow-purple-500/25"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Connect Wallet
                    </motion.button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <motion.button
                      onClick={openChainModal}
                      className="px-6 py-2.5 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 font-medium text-sm hover:bg-red-500/30 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Wrong Network
                    </motion.button>
                  );
                }

                return (
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={openChainModal}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {chain.hasIcon && (
                        <div
                          className="w-5 h-5 rounded-full overflow-hidden"
                          style={{ background: chain.iconBackground }}
                        >
                          {chain.iconUrl && (
                            <img alt={chain.name ?? "Chain icon"} src={chain.iconUrl} className="w-5 h-5" />
                          )}
                        </div>
                      )}
                      <span className="hidden sm:inline">{chain.name}</span>
                    </motion.button>

                    <motion.button
                      onClick={openAccountModal}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 text-sm font-medium hover:from-purple-600/30 hover:to-violet-600/30 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                      <span>{account.displayName}</span>
                      {account.displayBalance && (
                        <span className="text-muted-foreground hidden md:inline">{account.displayBalance}</span>
                      )}
                    </motion.button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </motion.div>
  );
}
