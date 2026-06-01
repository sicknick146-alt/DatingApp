import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  delta?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "default" | "positive" | "negative";
};

export function StatCard({ label, value, delta, icon: Icon, tone = "default" }: Props) {
  return (
    <div className="rounded-3xl bg-white/60 backdrop-blur-md p-6 shadow-xl shadow-rose-500/5 ring-1 ring-white/50">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-500">{label}</p>
        {Icon && <Icon className="h-5 w-5 text-slate-400" />}
      </div>
      <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
      {delta && (
        <p
          className={cn(
            "mt-2 text-xs font-bold",
            tone === "positive" && "text-emerald-500",
            tone === "negative" && "text-rose-500",
            tone === "default" && "text-slate-400",
          )}
        >
          {delta}
        </p>
      )}
    </div>
  );
}
