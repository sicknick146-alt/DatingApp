import { useState } from "react";
import { Button } from "@/components/ui/button";

export function StepBio({ profile, onNext }: { profile: any; onNext: (val: string) => void }) {
  const [value, setValue] = useState(profile?.bio || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onNext(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
      <div>
        <p className="text-slate-400 mb-6 text-center">
          Tell us a little bit about yourself. Be authentic and have fun!
        </p>
        <div className="max-w-md mx-auto">
          <textarea
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="I love spontaneous road trips, trying new coffee shops, and deep conversations..."
            className="w-full h-32 p-4 bg-black/50 border border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
          />
          <div className="text-right text-xs text-slate-500 mt-2">
            {value.length}/500
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button 
          type="submit" 
          disabled={!value.trim() || value.length > 500}
          className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12 px-8 w-full sm:w-auto"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
