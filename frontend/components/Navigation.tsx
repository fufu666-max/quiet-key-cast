"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Lock, BarChart3, Settings, Sparkles, Shield } from "lucide-react";

const navItems = [
  { id: "counter", label: "FHE Counter", icon: Lock, href: "/" },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/analytics" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export function Navigation() {
  const pathname = usePathname();

  const getActiveItem = () => {
    if (pathname === "/") return "counter";
    if (pathname === "/dashboard") return "dashboard";
    if (pathname === "/analytics") return "analytics";
    if (pathname === "/settings") return "settings";
    return "counter";
  };

  const activeItem = getActiveItem();

  return (
    <motion.nav
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed left-0 top-0 h-full w-64 glass border-r border-white/10 z-50"
    >
      <div className="flex flex-col h-full p-6">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
          </div>
          <div>
            <h1 className="font-bold text-lg gradient-text">FHE Crypto</h1>
            <p className="text-xs text-muted-foreground">Encrypted Computing</p>
          </div>
        </motion.div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <Link href={item.href}>
                  <motion.div
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      isActive ? "text-white" : "text-muted-foreground hover:text-white hover:bg-white/5"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-xl border border-purple-500/30"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-5 h-5 relative z-10 ${isActive ? "text-purple-400" : ""}`} />
                    <span className="relative z-10 font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full"
                        layoutId="activeIndicator"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-6 border-t border-white/10"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
              Z
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Zama FHEVM</p>
              <p className="text-xs text-muted-foreground">v0.3.0</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
