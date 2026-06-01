"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface Props {
  data: any[];
}

export default function AdminRevenueChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        {/* @ts-expect-error recharts types incompatible with React 19 */}
        <XAxis dataKey="m" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        {/* @ts-expect-error recharts types incompatible with React 19 */}
        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
        {/* @ts-expect-error recharts types incompatible with React 19 */}
        <Tooltip contentStyle={{ background: "rgba(255, 255, 255, 0.9)", border: "none", borderRadius: 12, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", color: "#0f172a", fontWeight: 600 }} />
        {/* @ts-expect-error recharts types incompatible with React 19 */}
        <Area type="monotone" dataKey="rev" stroke="#f43f5e" strokeWidth={3} fill="url(#rev)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
