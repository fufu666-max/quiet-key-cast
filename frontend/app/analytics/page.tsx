"use client";

import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/PageTransition";
import { useAccount } from "wagmi";
import { useDashboardDataWagmi } from "@/hooks/useDashboardDataWagmi";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { Wallet, TrendingUp, PieChart as PieChartIcon, BarChart3, Zap } from "lucide-react";

const COLORS = ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function AnalyticsPage() {
  const { isConnected } = useAccount();
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

  const operationDistribution = [
    { name: "Encryptions", value: dashboardData.totalEncryptions },
    { name: "Decryptions", value: dashboardData.totalDecryptions },
    {
      name: "Other",
      value: Math.max(
        0,
        dashboardData.totalOperations - dashboardData.totalEncryptions - dashboardData.totalDecryptions,
      ),
    },
  ];

  const hourlyData = dashboardData.activityData.slice(-12);

  const performanceData = [
    { metric: "Avg Latency", value: dashboardData.networkLatency, max: 500 },
    { metric: "Success Rate", value: 98, max: 100 },
    { metric: "Throughput", value: 85, max: 100 },
    { metric: "Uptime", value: 99.9, max: 100 },
  ];

  return (
    <div className="space-y-6">
      <AnimatedCard delay={0}>
        <div>
          <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
          <p className="text-muted-foreground mt-1">Detailed performance metrics and insights</p>
        </div>
      </AnimatedCard>

      <div className="grid grid-cols-2 gap-6">
        <AnimatedCard delay={0.1}>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <PieChartIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">Operation Distribution</h3>
                <p className="text-sm text-muted-foreground">By type</p>
              </div>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={operationDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {operationDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {operationDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">Hourly Activity</h3>
                <p className="text-sm text-muted-foreground">Last 12 hours</p>
              </div>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="time"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                  />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="operations" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.3}>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold">Performance Metrics</h3>
                <p className="text-sm text-muted-foreground">System health</p>
              </div>
            </div>
            <div className="space-y-4">
              {performanceData.map((item, index) => (
                <motion.div
                  key={item.metric}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{item.metric}</span>
                    <span className="text-sm font-medium">
                      {item.metric === "Avg Latency" ? `${item.value}ms` : `${item.value}%`}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / item.max) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.4}>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold">Encryption Trend</h3>
                <p className="text-sm text-muted-foreground">24h comparison</p>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="time"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
                    interval={3}
                  />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line type="monotone" dataKey="encryptions" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="decryptions" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
