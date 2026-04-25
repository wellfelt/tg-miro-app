import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Send, MessageSquare, Inbox, ExternalLink, AtSign, CheckCircle2, Loader2,
} from "lucide-react";

const TELEGRAM_BOT_URL = "https://t.me/miro_wfl_bot";

type MessageRow = {
  id: string;
  telegram_id: string;
  type: string;
  content: string | null;
  action: string | null;
  created_at: string;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч назад`;
  const d = Math.floor(h / 24);
  return `${d} д назад`;
}

function actionVariant(action: string | null): "secondary" | "default" | "outline" {
  if (!action) return "outline";
  const a = action.toLowerCase();
  if (a.includes("read") || a.includes("get") || a.includes("list")) return "secondary";
  return "default";
}

const Chat = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [tgUsername, setTgUsername] = useState("");
  const [savedTg, setSavedTg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [msgsRes, profileRes] = await Promise.all([
        supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20),
        user
          ? supabase.from("profiles").select("telegram_username").eq("id", user.id).maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ]);
      if (cancelled) return;
      if (msgsRes.data) setMessages(msgsRes.data as MessageRow[]);
      const tg = (profileRes.data as { telegram_username: string | null } | null)?.telegram_username ?? null;
      setSavedTg(tg);
      setTgUsername(tg ?? "");
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  const handleSaveTg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const clean = tgUsername.trim().replace(/^@/, "");
    if (!clean) {
      toast.error("Укажи username");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, telegram_username: clean }, { onConflict: "id" });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSavedTg(clean);
    toast.success("Telegram сохранён");
  };

  const isEmpty = !loading && messages.length === 0;

  return (
    <div className="app-dark min-h-screen bg-background text-foreground">
      <Navbar variant="dark" />

      <div className="container py-10 max-w-3xl">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">Чат</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">История бота</h1>
          <p className="text-muted-foreground mt-2">Подключи Telegram и смотри сообщения здесь</p>
        </div>

        {/* Section A — Connect Telegram */}
        {!savedTg && (
          <Card className="p-6 md:p-7 rounded-2xl border-border bg-card mb-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="h-11 w-11 rounded-xl bg-tg/15 text-tg grid place-items-center shrink-0">
                <Send className="h-5 w-5 -rotate-12" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold mb-1">Подключи Telegram</h2>
                <p className="text-sm text-muted-foreground">
                  Подключи Telegram, чтобы управлять доской прямо здесь.
                </p>
              </div>
            </div>

            <Button asChild variant="brand" size="lg" className="mb-5">
              <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">
                Открыть бота в Telegram <ExternalLink className="h-4 w-4" />
              </a>
            </Button>

            <form onSubmit={handleSaveTg} className="space-y-2">
              <label className="text-sm font-medium">Твой Telegram username</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={tgUsername}
                    onChange={(e) => setTgUsername(e.target.value)}
                    placeholder="username"
                    className="pl-10 rounded-full bg-secondary border-0"
                  />
                </div>
                <Button type="submit" variant="hero" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Сохранить"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {savedTg && (
          <Card className="p-4 rounded-2xl border-border bg-card mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-success/15 text-success grid place-items-center shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">Telegram подключён</p>
                <p className="text-xs text-muted-foreground font-mono truncate">@{savedTg}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSavedTg(null)}>Изменить</Button>
          </Card>
        )}

        {/* Section B — Message history */}
        <Card className="p-6 rounded-2xl border-border bg-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-lg font-semibold">Последние сообщения</h2>
              <p className="text-xs text-muted-foreground">20 свежих записей</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-[10px] font-mono">live</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : isEmpty ? (
            <div className="py-14 text-center">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-secondary grid place-items-center text-muted-foreground mb-3">
                <Inbox className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Сообщений пока нет — напиши боту в Telegram
              </p>
              <Button asChild variant="outline" size="sm">
                <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">
                  Открыть бота <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {messages.map(m => (
                <li key={m.id} className="p-4 rounded-xl bg-secondary/40 border border-border/50">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm leading-relaxed flex-1">
                      {m.content || <span className="text-muted-foreground italic">без текста</span>}
                    </p>
                    {m.action && (
                      <Badge variant={actionVariant(m.action)} className="shrink-0 font-mono text-[10px]">
                        {m.action}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                    <span>@{m.telegram_id}</span>
                    <span>·</span>
                    <span>{timeAgo(m.created_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Floating CTA */}
      <a
        href={TELEGRAM_BOT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand text-primary-foreground font-semibold text-sm shadow-elegant hover:shadow-glow transition-all animate-pulse-glow"
      >
        <MessageSquare className="h-4 w-4" />
        Написать боту →
      </a>
    </div>
  );
};

export default Chat;
