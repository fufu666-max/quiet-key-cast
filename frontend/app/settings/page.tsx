"use client";

import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/PageTransition";
import { useAccount } from "wagmi";
import { useFhevm } from "@/fhevm/useFhevm";
import { useState } from "react";
import {
  Wallet,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const { address, isConnected, chainId } = useAccount();

  const { status: fhevmStatus } = useFhevm({
    provider: undefined,
    chainId,
    initialMockChains: { 31337: "http://localhost:8545" },
    enabled: isConnected,
  });

  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");

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
    <div className="space-y-6 max-w-3xl">
      <AnimatedCard delay={0}>
        <div>
          <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your preferences</p>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={0.1}>
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold">Account</h3>
              <p className="text-sm text-muted-foreground">Wallet connection details</p>
            </div>
          </div>

          <div className="space-y-4">
            <SettingRow
              label="Connected Address"
              value={address ? `${address.slice(0, 10)}...${address.slice(-8)}` : "Not connected"}
            />
            <SettingRow label="Chain ID" value={chainId?.toString() || "Unknown"} />
            <SettingRow
              label="FHEVM Status"
              value={fhevmStatus}
              status={fhevmStatus === "ready" ? "success" : "warning"}
            />
          </div>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={0.2}>
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">Preferences</h3>
              <p className="text-sm text-muted-foreground">Customize your experience</p>
            </div>
          </div>

          <div className="space-y-4">
            <ToggleSetting
              icon={Bell}
              label="Notifications"
              description="Receive alerts for transactions"
              enabled={notifications}
              onToggle={() => setNotifications(!notifications)}
            />
            <ToggleSetting
              icon={Globe}
              label="Auto Refresh"
              description="Automatically update data"
              enabled={autoRefresh}
              onToggle={() => setAutoRefresh(!autoRefresh)}
            />
          </div>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={0.3}>
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Palette className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold">Appearance</h3>
              <p className="text-sm text-muted-foreground">Choose your theme</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <ThemeOption icon={Moon} label="Dark" selected={theme === "dark"} onClick={() => setTheme("dark")} />
            <ThemeOption icon={Sun} label="Light" selected={theme === "light"} onClick={() => setTheme("light")} />
            <ThemeOption
              icon={Monitor}
              label="System"
              selected={theme === "system"}
              onClick={() => setTheme("system")}
            />
          </div>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={0.4}>
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold">Security</h3>
              <p className="text-sm text-muted-foreground">Encryption settings</p>
            </div>
          </div>

          <div className="space-y-3">
            <LinkSetting label="Manage Permissions" />
            <LinkSetting label="View Encryption Keys" />
            <LinkSetting label="Clear Local Data" />
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}

function SettingRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: "success" | "warning" | "error";
}) {
  const statusColors = { success: "text-emerald-400", warning: "text-yellow-400", error: "text-red-400" };
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono text-sm ${status ? statusColors[status] : ""}`}>{value}</span>
    </div>
  );
}

function ToggleSetting({
  icon: Icon,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <motion.button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-purple-500" : "bg-white/20"}`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 rounded-full bg-white"
          animate={{ left: enabled ? 28 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
}

function ThemeOption({
  icon: Icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${selected ? "border-purple-500 bg-purple-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5"}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {selected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2">
          <Check className="w-4 h-4 text-purple-400" />
        </motion.div>
      )}
      <Icon className={`w-6 h-6 ${selected ? "text-purple-400" : "text-muted-foreground"}`} />
      <span className={`text-sm ${selected ? "text-white" : "text-muted-foreground"}`}>{label}</span>
    </motion.button>
  );
}

function LinkSetting({ label }: { label: string }) {
  return (
    <motion.button
      className="flex items-center justify-between w-full py-3 border-b border-white/5 last:border-0 hover:text-purple-400 transition-colors"
      whileHover={{ x: 4 }}
    >
      <span>{label}</span>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </motion.button>
  );
}
