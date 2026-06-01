import { adminUsers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { BadgeCheck, ShieldAlert } from "lucide-react";

export default function VerificationPage() {
  const pending = adminUsers.filter((u) => !u.verified);
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Profile verification</h1>
        <p className="text-sm text-muted-foreground">Approve government-ID submissions to issue the verified badge.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {pending.map((u) => (
          <div key={u.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
              <ShieldAlert className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="aspect-[3/2] rounded-lg bg-muted" />
              <div className="aspect-[3/2] rounded-lg bg-muted" />
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1 bg-primary"><BadgeCheck className="mr-2 h-4 w-4" />Approve</Button>
              <Button className="flex-1" variant="outline">Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
