import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export function StepTags({
  type,
  profile,
  onNext,
}: {
  type: "personality" | "interests" | "hobbies";
  profile: any;
  onNext: (val: string) => void;
}) {
  const [tags, setTags] = useState<string[]>(
    profile?.[type] ? profile[type].split(",").map((t: string) => t.trim()).filter(Boolean) : []
  );
  const [inputValue, setInputValue] = useState("");

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = inputValue.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    // Also include what's currently in the input just in case they forgot to press enter
    let finalTags = [...tags];
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      finalTags.push(inputValue.trim());
    }
    if (finalTags.length > 0) {
      onNext(finalTags.join(","));
    }
  };

  const placeholders = {
    personality: "e.g. Introverted, Witty, Adventurous...",
    interests: "e.g. Reading, Coffee, True Crime...",
    hobbies: "e.g. Hiking, Photography, Baking...",
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <p className="text-slate-400 mb-6 text-center">
          Add some tags that describe your {type}. Press enter to add.
        </p>

        <div className="max-w-md mx-auto">
          <div className="flex gap-2 mb-4 flex-wrap">
            {tags.map((t) => (
              <div
                key={t}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-sm"
              >
                {t}
                <button
                  onClick={() => removeTag(t)}
                  className="text-rose-400 hover:text-white transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholders[type]}
              className="h-12 bg-black/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-rose-500"
            />
            <Button
              onClick={handleAdd}
              type="button"
              className="h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl px-6"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={tags.length === 0 && !inputValue.trim()}
          className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12 px-8 w-full sm:w-auto"
        >
          {type === "hobbies" ? "Finish" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
