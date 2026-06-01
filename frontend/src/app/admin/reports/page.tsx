"use client";

import { useState, useEffect } from "react";
import { reports as mockReports } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getToken } from "@/lib/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ReportsPage() {
  const [list, setList] = useState(mockReports);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API}/admin/contacts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const mappedReports = data.map((c: any) => ({
              id: c.id.toString(),
              reportedUser: c.email,
              reason: c.subject || c.message.substring(0, 20) + '...',
              reportedBy: "System/User", // Assuming general source for now
              createdAt: new Date(c.createdAt).toISOString().split('T')[0],
              status: c.status,
            }));
            
            const merged = [...mappedReports, ...mockReports];
            setList(merged);
          }
        }
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reports & complaints</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Keep the platform safe by reviewing flagged behavior and content.</p>
      </header>
      <div className="space-y-4">
        {loading && list === mockReports && (
           <div className="p-8 text-center text-slate-500 font-medium">Loading real reports...</div>
        )}
        {!loading && list.length === 0 && (
           <div className="p-8 text-center text-slate-500 font-medium">No reports found.</div>
        )}
        {list.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/60 backdrop-blur-md p-6 shadow-xl shadow-rose-500/5 ring-1 ring-white/50 transition-all hover:bg-white/80">
            <div>
              <p className="font-bold text-slate-900">{r.reportedUser}</p>
              <p className="text-sm font-medium text-slate-600 mt-1">{r.reason}</p>
              <p className="mt-2 text-xs font-semibold text-slate-400">Reported by {r.reportedBy} · {r.createdAt}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn(
                "rounded-full px-4 py-1.5 text-xs font-bold capitalize shadow-sm",
                r.status === "open" && "bg-rose-100 text-rose-700",
                r.status === "reviewing" && "bg-amber-100 text-amber-700",
                r.status === "closed" && "bg-emerald-100 text-emerald-700",
              )}>{r.status}</span>
              <Button size="sm" variant="outline" className="h-9 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm font-semibold">Review</Button>
              <Button size="sm" className="h-9 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-lg shadow-rose-500/30 font-semibold">Resolve</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
