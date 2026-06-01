import { tickets } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Support tickets</h1>
        <p className="text-sm text-muted-foreground">Address complaints and check resolution status.</p>
      </header>
      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5">
            <div>
              <p className="font-medium">{t.subject}</p>
              <p className="text-xs text-muted-foreground">From {t.user} · {t.created}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn(
                "rounded-full px-3 py-1 text-xs font-medium capitalize",
                t.status === "open" && "bg-rose-100 text-rose-700",
                t.status === "pending" && "bg-amber-100 text-amber-700",
                t.status === "resolved" && "bg-emerald-100 text-emerald-700",
              )}>{t.status}</span>
              <Button size="sm" variant="outline">Reply</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
