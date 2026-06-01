import { adminUsers } from "@/lib/mock-data";
import { StatCard } from "@/features/admin/StatCard";
import { Crown, Users, TrendingUp } from "lucide-react";

export default function SubscriptionsPage() {
  const free = adminUsers.filter((u) => u.plan === "Free").length;
  const plus = adminUsers.filter((u) => u.plan === "Plus").length;
  const premium = adminUsers.filter((u) => u.plan === "Premium").length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Subscriptions</h1>
        <p className="text-sm text-muted-foreground">Monitor plan distribution and conversion.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Free users" value={String(free)} icon={Users} />
        <StatCard label="Plus subscribers" value={String(plus)} icon={TrendingUp} />
        <StatCard label="Premium subscribers" value={String(premium)} icon={Crown} />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">User</th><th className="px-5 py-3">Plan</th><th className="px-5 py-3">Since</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.filter((u) => u.plan !== "Free").map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-5 py-3">{u.name}<div className="text-xs text-muted-foreground">{u.email}</div></td>
                <td className="px-5 py-3">{u.plan}</td>
                <td className="px-5 py-3">{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
