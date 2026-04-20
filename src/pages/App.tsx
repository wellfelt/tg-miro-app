import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { Send, Mic, Sparkles, MessageSquare, Square, ArrowRight, Maximize2 } from "lucide-react";
import { track } from "@/lib/analytics";

type Msg = { id: number; from: "user" | "bot"; text: string; type: "text" | "voice"; action?: string; time: string };

const seed: Msg[] = [
  { id: 1, from: "user", text: "Создай 4 стикера: цели, риски, ресурсы, дедлайны", type: "text", action: "create_sticker", time: "10:42" },
  { id: 2, from: "bot", text: "Готово. Разложил по углам.", type: "text", time: "10:42" },
  { id: 3, from: "user", text: "🎤 голосовое 0:08", type: "voice", action: "create_arrow", time: "10:43" },
  { id: 4, from: "bot", text: "Соединил «цели» → «дедлайны» стрелкой.", type: "text", time: "10:43" },
  { id: 5, from: "user", text: "Подсвети риски жёлтым", type: "text", action: "color_change", time: "10:45" },
  { id: 6, from: "bot", text: "Готово ✨", type: "text", time: "10:45" },
  { id: 7, from: "user", text: "Добавь рамку «Q1 план»", type: "text", action: "create_frame", time: "10:48" },
  { id: 8, from: "bot", text: "Создал рамку 1200×800.", type: "text", time: "10:48" },
];

const stickers = [
  { c: "bg-yellow-200", t: "Цели Q1",     r: "rotate-[-4deg]", l: "top-8 left-8" },
  { c: "bg-rose-200",   t: "Риски",       r: "rotate-[3deg]",  l: "top-12 right-12" },
  { c: "bg-blue-200",   t: "Ресурсы",     r: "rotate-[2deg]",  l: "bottom-16 left-12" },
  { c: "bg-emerald-200",t: "Дедлайны",    r: "rotate-[-3deg]", l: "bottom-10 right-8" },
  { c: "bg-purple-200", t: "Идеи 💡",     r: "rotate-[5deg]",  l: "top-1/2 left-1/3" },
];

const App = () => {
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [hasSentFirst, setHasSentFirst] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  // Demo: entering /app simulates a connected Miro board.
  useEffect(() => {
    track("board_connected", { board_id: "demo-q1-roadmap", source: "demo" });
  }, []);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const now = new Date().toTimeString().slice(0, 5);
    const userMsg: Msg = { id: Date.now(), from: "user", text: input, type: "text", time: now };
    setMsgs(m => [...m, userMsg]);
    if (!hasSentFirst) {
      track("first_message", { type: "text", length: input.length });
      setHasSentFirst(true);
    }
    setInput("");
    setTimeout(() => {
      const bot: Msg = { id: Date.now()+1, from: "bot", text: "Принял. Применяю на доску ✨", type: "text", time: now };
      setMsgs(m => [...m, bot].slice(-10));
    }, 600);
  };

  const handleVoice = () => {
    track("voice_message", { duration_sec: null, source: "mic_button" });
    if (!hasSentFirst) {
      track("first_message", { type: "voice" });
      setHasSentFirst(true);
    }
  };

  return (
    <div className="app-dark min-h-screen bg-background text-foreground">
      <Navbar variant="dark" />

      <div className="container py-6 grid lg:grid-cols-[420px_1fr] gap-5 h-[calc(100vh-4rem-3rem)]">
        {/* Chat */}
        <Card className="flex flex-col rounded-2xl border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-brand grid place-items-center">
                <Send className="h-4 w-4 text-primary-foreground -rotate-12" />
              </div>
              <div>
                <p className="font-semibold text-sm">Miro Bot</p>
                <p className="text-xs text-success flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> в сети
                </p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground font-mono">последние 10</span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
            {msgs.slice(-10).map(m => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"} animate-slide-up`}>
                <div className="max-w-[85%]">
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.from === "user"
                      ? "bg-brand text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm"
                  }`}>
                    {m.text}
                  </div>
                  <div className={`mt-1 flex items-center gap-2 text-[10px] text-muted-foreground font-mono ${m.from === "user" ? "justify-end" : ""}`}>
                    <span>{m.time}</span>
                    {m.action && <span className="px-1.5 py-0.5 rounded-full bg-secondary text-[9px]">{m.action}</span>}
                    {m.type === "voice" && <Mic className="h-3 w-3 text-accent" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={send} className="p-3 border-t border-border flex gap-2">
            <Button type="button" size="icon" variant="ghost" className="shrink-0">
              <Mic className="h-4 w-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напиши команду…"
              className="bg-secondary border-0 rounded-full"
            />
            <Button type="submit" variant="brand" size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        {/* Miro mock */}
        <Card className="relative rounded-2xl border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-miro/90 grid place-items-center">
                <Square className="h-3 w-3 text-foreground" fill="currentColor" />
              </div>
              <span className="font-semibold text-sm">Q1 Roadmap · доска</span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-success/15 text-success text-[10px] font-mono">live</span>
            </div>
            <Button size="icon" variant="ghost"><Maximize2 className="h-4 w-4" /></Button>
          </div>

          <div className="relative h-[calc(100%-3.5rem)] ring-grid bg-secondary/30 overflow-hidden">
            {stickers.map((s, i) => (
              <div
                key={i}
                className={`absolute ${s.l} ${s.r} ${s.c} w-32 h-32 rounded-md shadow-lg p-3 font-display font-semibold text-foreground/80 hover:scale-105 hover:rotate-0 transition-transform cursor-pointer`}
              >
                {s.t}
                <span className="absolute bottom-1 right-2 text-[9px] font-mono opacity-50">tg</span>
              </div>
            ))}

            {/* Arrow */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="hsl(var(--primary))" />
                </marker>
              </defs>
              <path d="M 18,18 Q 50,50 78,82" stroke="hsl(var(--primary))" strokeWidth="0.4" fill="none" strokeDasharray="1 1" markerEnd="url(#arrow)" />
            </svg>

            <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-md border border-border text-xs">
              <Sparkles className="h-3 w-3 text-accent" />
              <span>5 элементов · обновлено сейчас</span>
            </div>

            <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-md border border-border text-[10px] font-mono text-muted-foreground">
              demo preview · реальный Miro подключим позже
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default App;
