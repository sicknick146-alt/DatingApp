"use client";

import { useState, useEffect, useRef } from "react";
import { matches as mockMatches, discoverProfiles, conversation, type Message } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical, Send, Check, CheckCheck, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const allProfiles = [...mockMatches, ...discoverProfiles].reduce((acc, profile) => {
  acc[profile.id] = profile;
  return acc;
}, {} as Record<string, any>);

export default function Messages() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dbMatches, setDbMatches] = useState<any[]>([]);
  const [localConversations, setLocalConversations] = useState<Record<string, Message[]>>(conversation);
  
  const displayMatches = dbMatches.length > 0 
    ? Array.from(new Map(dbMatches.map(m => [m.targetProfileId, m])).values()).map(m => {
        const profile = allProfiles[m.targetProfileId] || {};
        return {
          id: m.targetProfileId,
          name: profile.name || "Unknown",
          age: profile.age || "",
          photo: profile.photo || "",
          online: profile.online || false,
          lastMessage: mockMatches.find(mm => mm.id === m.targetProfileId)?.lastMessage || "No messages yet.",
          unread: mockMatches.find(mm => mm.id === m.targetProfileId)?.unread || 0,
        };
      }) 
    : mockMatches;

  const active = displayMatches.find((m) => m.id === activeId) || (activeId && allProfiles[activeId] ? { 
    id: activeId, 
    name: allProfiles[activeId].name, 
    age: allProfiles[activeId].age, 
    photo: allProfiles[activeId].photo, 
    online: allProfiles[activeId].online,
    unread: 0,
    lastMessage: "No messages yet."
  } : undefined);
  const [draft, setDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  
  // Initialize unread counts from local storage or mock data
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("unreadCounts");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse unreadCounts from localStorage", e);
        }
      }
    }
    const initial: Record<string, number> = {};
    mockMatches.forEach(m => { initial[m.id] = m.unread || 0; });
    return initial;
  });

  // Sync unread counts to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("unreadCounts", JSON.stringify(unreadCounts));
    }
  }, [unreadCounts]);

  const msgs = activeId ? (localConversations[activeId] ?? []) : [];
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, isTyping]);

  // Fetch all messages from database on initial load for proper sorting
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const matchId = params.get("id");
    if (matchId) {
      setActiveId(matchId);
    }

    fetch("http://localhost:3001/matches")
      .then(res => res.json())
      .then(data => {
         if (Array.isArray(data)) {
           setDbMatches(data.filter((m: any) => m.status === "MATCHED"));
         }
      })
      .catch(console.error);

    fetch(`http://localhost:3001/messages`)
      .then(res => res.json())
      .then((data: any[]) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setLocalConversations(prev => {
            const updated = { ...prev };
            const grouped: Record<string, Message[]> = {};
            data.forEach(msg => {
              if (!grouped[msg.matchId]) grouped[msg.matchId] = [];
              grouped[msg.matchId].push(msg);
            });
            
            for (const mId in grouped) {
              const currentMock = conversation[mId] || [];
              updated[mId] = [...currentMock, ...grouped[mId]];
            }
            return updated;
          });
        }
      })
      .catch(err => console.error("Failed to fetch messages:", err));
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!draft.trim() || !activeId) return;

    const text = draft.trim();
    const at = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDraft("");

    const newLocalMsg = { 
      id: Date.now().toString(), 
      from: "me", 
      text, 
      at, 
      status: "sent",
      createdAt: new Date().toISOString()
    } as any;

    setLocalConversations(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newLocalMsg]
    }));

    try {
      const res = await fetch(`http://localhost:3001/messages/${activeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: "me", text, at })
      });
      const savedMsg: Message = await res.json();
      
      // Update status to delivered
      setLocalConversations(prev => {
        const chat = prev[activeId] || [];
        return {
          ...prev,
          [activeId]: chat.map(m => m.id === newLocalMsg.id ? { ...m, ...savedMsg, status: "delivered" } : m)
        };
      });
    } catch (err) {
      console.error("Failed to send message to backend:", err);
    }
  };

  const handleUnsend = async (msgId: string) => {
    if (!activeId) return;
    setLocalConversations(prev => {
      const updated = { ...prev };
      if (updated[activeId]) {
        updated[activeId] = updated[activeId].filter(m => m.id !== msgId);
      }
      return updated;
    });

    try {
      await fetch(`http://localhost:3001/messages/${msgId}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Failed to unsend message:", err);
    }
  };

  const handleSelectMatch = (id: string) => {
    setActiveId(id);
    // Clear unread count when opened
    setUnreadCounts(prev => ({ ...prev, [id]: 0 }));
  };

  // Dynamic sorting based on the latest message timestamp
  const sortedMatches = [...displayMatches]
    .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const msgsA = localConversations[a.id] || [];
      const msgsB = localConversations[b.id] || [];
      
      const getTime = (msgs: any[]) => {
        if (msgs.length === 0) return 0;
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg.createdAt) {
          return new Date(lastMsg.createdAt).getTime();
        }
        const timeStr = lastMsg.at || "";
        const parsed = new Date(`1970/01/01 ${timeStr}`).getTime();
        return isNaN(parsed) ? 0 : parsed;
      };

      const timeA = getTime(msgsA);
      const timeB = getTime(msgsB);
      return timeB - timeA;
    });

  return (
    <div className="grid h-[calc(100vh-7rem)] gap-4 lg:grid-cols-[320px_1fr]">
      <aside className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search matches..." 
              className="pl-9 h-9 bg-muted/50 border-none" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ul className="flex-1 overflow-y-auto divide-y divide-border">
          {sortedMatches.map((m) => {
            const chat = localConversations[m.id] || [];
            const lastMsg = chat.length > 0 ? chat[chat.length - 1].text : m.lastMessage;
            const unread = unreadCounts[m.id] || 0;
            
            return (
              <li key={m.id}>
                <button
                  onClick={() => handleSelectMatch(m.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                    activeId === m.id ? "bg-muted" : "hover:bg-muted/50",
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={m.photo} />
                      <AvatarFallback>{m.name[0]}</AvatarFallback>
                    </Avatar>
                    {m.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-semibold">{m.name}</p>
                      {unread > 0 && activeId !== m.id && (
                        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[color:var(--brand)] px-1.5 text-[10px] font-semibold text-white">
                          {unread}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {isTyping[m.id] ? <span className="text-[color:var(--brand)] italic">typing...</span> : lastMsg}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {active ? (
        <section className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm">
          <header className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={active.photo} />
                <AvatarFallback>{active.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{active.name}, {active.age}</p>
                <p className="text-xs text-muted-foreground">{active.online ? "Online now" : "Offline"}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Button variant="ghost" size="icon" onClick={() => alert("Calling...")}><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => alert("Starting video...")}><Video className="h-4 w-4" /></Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">Block User</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-6">
            {msgs.map((m: any) => (
              <div key={m.id} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                {m.from === "me" ? (
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <div className="max-w-[70%] rounded-2xl px-4 py-2 text-sm relative bg-[color:var(--brand)] text-white rounded-br-sm cursor-context-menu select-none">
                        {m.text}
                        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                          {m.at}
                          {m.status === "delivered" ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                        </div>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem className="text-red-500 cursor-pointer" onClick={() => handleUnsend(m.id)}>
                        Unsend Message
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ) : (
                  <div className="max-w-[70%] rounded-2xl px-4 py-2 text-sm relative bg-muted text-foreground rounded-bl-sm">
                    {m.text}
                    <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                      {m.at}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping[activeId] && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl px-4 py-3 text-sm bg-muted text-foreground rounded-bl-sm flex gap-1 items-center">
                  <span className="h-1.5 w-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-1.5 w-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-1.5 w-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <Input 
              value={draft} 
              onChange={(e) => setDraft(e.target.value)} 
              placeholder="Type a message…" 
              className="h-10 rounded-full px-4 border-none bg-muted/50" 
            />
            <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-full bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90 text-white">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-card shadow-sm text-muted-foreground p-8 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Your Messages</h3>
          <p>Select a conversation from the sidebar to start chatting.</p>
        </section>
      )}
    </div>
  );
}
