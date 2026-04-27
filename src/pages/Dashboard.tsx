import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, ExternalLink, Layers, Loader2, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";

const TELEGRAM_BOT_URL = "https://t.me/miro_wfl_bot";

function extractBoardId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  // Try to pull the id segment from a Miro share URL: https://miro.com/app/board/<id>/
  const m = trimmed.match(/miro\.com\/app\/board\/([^/?#]+)/i);
  if (m) return m[1];
  // Otherwise treat as raw id
  return trimmed;
}

const Dashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [boardInput, setBoardInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setBoardInput(profile?.board_url ?? "");
  }, [profile?.board_url]);

  const handleSaveBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const boardId = extractBoardId(boardInput);
    if (!boardId) {
      toast.error("Введите ссылку на доску или ID");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ board_id: boardId, board_url: boardInput.trim() })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshProfile();
    toast.success("Доска сохранена");
  };

  const tgConnected = profile?.telegram_id != null;

  return (
    <div className="app-dark min-h-screen bg-background text-foreground">
      <Navbar variant="dark" />

      <div className="container py-10 max-w-3xl">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">Кабинет</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Личный кабинет</h1>
          <p className="text-muted-foreground mt-2">{profile?.email ?? user?.email}</p>
        </div>

        <div className="space-y-5">
          {/* Telegram Bot */}
          <Card className="p-6 rounded-2xl border-border bg-card">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-tg/15 text-tg grid place-items-center shrink-0">
                  <Send className="h-5 w-5 -rotate-12" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold mb-1">Telegram Bot</h2>
                  <p className="text-sm text-muted-foreground">
                    Напишите <span className="font-mono">/start</span> боту{" "}
                    <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="text-tg underline">
                      @miro_wfl_bot
                    </a>{" "}
                    в Telegram для активации
                  </p>
                </div>
              </div>
              {tgConnected ? (
                <Badge className="bg-success/15 text-success border-success/20 hover:bg-success/15 shrink-0">
                  <CheckCircle2 className="h-3 w-3" /> Подключён
                </Badge>
              ) : (
                <Badge variant="secondary" className="shrink-0">
                  <AlertCircle className="h-3 w-3" /> Не подключён
                </Badge>
              )}
            </div>

            {tgConnected && (
              <div className="rounded-xl bg-secondary/40 border border-border/50 p-3 text-sm font-mono">
                {profile?.username ? `@${profile.username}` : `id ${profile?.telegram_id}`}
              </div>
            )}

            {!tgConnected && (
              <Button asChild variant="brand" size="sm" className="mt-2">
                <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">
                  Открыть бота <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </Card>

          {/* Miro Board */}
          <Card className="p-6 rounded-2xl border-border bg-card">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-11 w-11 rounded-xl bg-primary/15 text-primary grid place-items-center shrink-0">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold mb-1">Miro Board</h2>
                <p className="text-sm text-muted-foreground">
                  Найдите ссылку: откройте доску Miro → Share → Copy link
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveBoard} className="space-y-3">
              <Input
                value={boardInput}
                onChange={(e) => setBoardInput(e.target.value)}
                placeholder="Вставьте ссылку на доску Miro или ID"
                className="rounded-xl bg-secondary border-0 h-11"
              />
              <div className="flex items-center justify-between gap-3 flex-wrap">
                {profile?.board_url ? (
                  <p className="text-xs text-muted-foreground font-mono truncate max-w-[60%]">
                    Сохранено: <span className="text-foreground">{profile.board_id}</span>
                  </p>
                ) : (
                  <span className="text-xs text-muted-foreground">Доска ещё не подключена</span>
                )}
                <Button type="submit" variant="hero" size="sm" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Сохранить"}
                </Button>
              </div>
            </form>
          </Card>

          {/* How to use */}
          <Card className="p-6 rounded-2xl border-border bg-card">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-11 w-11 rounded-xl bg-accent/15 text-accent grid place-items-center shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold mb-1">Как пользоваться</h2>
                <p className="text-sm text-muted-foreground">Три простых шага до первого результата</p>
              </div>
            </div>
            <ol className="space-y-3">
              {[
                "Активируйте бота в Telegram",
                "Подключите доску Miro выше",
                "Напишите боту что создать (блок-схему, майндмап, стикеры)",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="h-6 w-6 rounded-full bg-secondary grid place-items-center font-mono text-xs shrink-0">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
