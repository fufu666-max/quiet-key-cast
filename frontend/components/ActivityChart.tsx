"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ActivityDataPoint } from "@/hooks/useDashboardDataWagmi";
import { BarChart3 } from "lucide-react";

interface ActivityChartProps {
  data: ActivityDataPoint[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const hasData = data.some((d) => d.operations > 0 || d.encryptions > 0);

  return (
    <div className="glass rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold">Activity Overview</h3>
            <p className="text-sm text-muted-foreground">Last 24 hours</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-muted-foreground">Operations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">FHE Ops</span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[300px]"
      >
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOperations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEncryptions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 24, 39, 0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="operations"
                stroke="#a855f7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOperations)"
                name="Operations"
              />
              <Area
                type="monotone"
                dataKey="encryptions"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEncryptions)"
                name="FHE Operations"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No activity data yet</p>
              <p className="text-sm mt-1">Perform some transactions to see the chart</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
