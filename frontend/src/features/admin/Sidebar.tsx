"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Flag, BarChart3, CreditCard,
  Receipt, LifeBuoy, ShieldCheck, Heart, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/reports", label: "Reports", icon: Flag },
  { to: "/admin/verification", label: "Verification", icon: ShieldCheck },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/admin/payments", label: "Payments", icon: Receipt },
  { to: "/admin/tickets", label: "Support", icon: LifeBuoy },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col bg-white/40 backdrop-blur-xl z-10">
      <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 shadow-md shadow-rose-500/20">
          <Heart className="h-3.5 w-3.5 text-white fill-white" strokeWidth={0} />
        </div>
        <div>
          <p className="text-sm font-bold leading-none text-slate-900">ConnectLove</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-rose-500">Admin</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              href={it.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-rose-50 text-rose-600 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-rose-600" : "text-slate-400")} />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 p-3">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors">
          <LogOut className="h-4 w-4" /> Exit admin
        </Link>
      </div>
    </aside>
  );
}
