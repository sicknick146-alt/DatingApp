import { payments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Payment monitoring</h1>
        <p className="text-sm text-muted-foreground">Track payment status across plans.</p>
      </header>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">User</th><th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Amount</th><th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-5 py-3">{p.user}</td>
                <td className="px-5 py-3">{p.plan}</td>
                <td className="px-5 py-3">${p.amount.toFixed(2)}</td>
                <td className="px-5 py-3">{p.date}</td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                    p.status === "successful" && "bg-emerald-100 text-emerald-700",
                    p.status === "pending" && "bg-amber-100 text-amber-700",
                    p.status === "refunded" && "bg-rose-100 text-rose-700",
                  )}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
