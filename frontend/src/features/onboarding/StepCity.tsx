import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

export function StepCity({ profile, onNext }: { profile: any; onNext: (val: string) => void }) {
  const [value, setValue] = useState(profile?.city || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onNext(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
      <div>
        <p className="text-slate-400 mb-6 text-center">
          Let matches know where you are based so you can meet up easily.
        </p>
        <div className="relative max-w-xs mx-auto">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
            <MapPin className="h-5 w-5" />
          </div>
          <Input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. New York, NY"
            className="pl-10 h-14 bg-black/50 border-white/10 text-white placeholder:text-slate-500 text-lg rounded-xl focus-visible:ring-rose-500"
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button 
          type="submit" 
          disabled={!value.trim()}
          className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12 px-8 w-full sm:w-auto"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
