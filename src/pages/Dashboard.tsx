import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { MessageSquare, Mic, Users, Inbox, Type, Activity, UserPlus } from "lucide-react";

type MessageRow = {
  id: string;
  telegram_id: string;
  type: "text" | "voice";
  content: string | null;
  action: string | null;
  created_at: string;
};

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--tg))",
  "hsl(var(--success))",
];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 12,
  fontSize: 12,
  color: "hsl(var(--foreground))",
};

const WEEKDAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

type SignupRow = { day: string; count: number };

function formatSignups(rows: { day: string; count: number | string }[]): SignupRow[] {
  return rows.map(r => {
    const d = new Date(r.day);
    return {
      day: WEEKDAYS[d.getDay()],
      count: Number(r.count) || 0,
    };
  });
}

function categorizeAction(action: string | null): "sticky" | "shape" | "read" | "other" {
  if (!action) return "other";
  const a = action.toLowerCase();
  if (a.includes("stick")) return "sticky";
  if (a.includes("shape") || a.includes("arrow") || a.includes("frame") || a.includes("rect") || a.includes("circle")) return "shape";
  if (a.includes("read") || a.includes("get") || a.includes("list") || a.includes("view")) return "read";
  return "other";
}

function buildActionDistribution(messages: MessageRow[]) {
  const counts: Record<string, number> = { sticky: 0, shape: 0, read: 0, other: 0 };
  for (const m of messages) counts[categorizeAction(m.action)]++;
  const labels: Record<string, string> = {
    sticky: "Стикеры",
    shape: "Фигуры",
    read: "Чтение",
    other: "Прочее",
  };
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: labels[k], value: v }));
}

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

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [recent, setRecent] = useState<MessageRow[]>([]);
  const [signups, setSignups] = useState<SignupRow[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const sb = supabase as unknown as {
        rpc: (fn: string) => Promise<{ data: unknown; error: unknown }>;
      };

      const [weekRes, recentRes, signupsRes, totalUsersRes] = await Promise.all([
        supabase
          .from("messages")
          .select("*")
          .gte("created_at", sevenDaysAgo.toISOString()),
        supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10),
        sb.rpc("get_signups_per_day"),
        sb.rpc("get_total_users"),
      ]);

      if (cancelled) return;
      if (weekRes.data) setMessages(weekRes.data as MessageRow[]);
      if (recentRes.data) setRecent(recentRes.data as MessageRow[]);
      if (Array.isArray(signupsRes.data)) {
        setSignups(formatSignups(signupsRes.data as { day: string; count: number }[]));
      }
      if (typeof totalUsersRes.data === "number") {
        setTotalUsers(totalUsersRes.data);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const totalMessages = messages.length;
  const voiceCount = messages.filter(m => m.type === "voice").length;
  const textCount = totalMessages - voiceCount;
  const actionDist = buildActionDistribution(messages);
  const isEmpty = !loading && totalMessages === 0;

  const stats = [
    { icon: UserPlus,      label: "Всего пользователей",       value: totalUsers.toLocaleString("ru"),    color: "text-primary" },
    { icon: MessageSquare, label: "Всего сообщений",           value: totalMessages.toLocaleString("ru"), color: "text-tg" },
    { icon: Mic,           label: "Голосовых",                 value: voiceCount.toLocaleString("ru"),    color: "text-accent" },
    { icon: Type,          label: "Текстовых",                 value: textCount.toLocaleString("ru"),     color: "text-success" },
  ];

  return (
    <div className="app-dark min-h-screen bg-background text-foreground">
      <Navbar variant="dark" />

      <div className="container py-10">
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">Аналитика</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold">Метрики бота</h1>
            <p className="text-muted-foreground mt-2">Последние 7 дней · реальные данные</p>
          </div>
          <div className="px-4 py-2 rounded-full bg-secondary text-xs font-mono text-muted-foreground">
            {loading ? "загрузка…" : "обновлено сейчас"}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <Card key={s.label} className="p-5 rounded-2xl border-border bg-card hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-10 w-10 rounded-xl bg-secondary grid place-items-center ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="font-display text-3xl font-bold">{s.value}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {isEmpty ? (
          <Card className="p-12 rounded-2xl border-border bg-card text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-secondary grid place-items-center text-muted-foreground mb-4">
              <Inbox className="h-7 w-7" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-1">No messages yet</h3>
            <p className="text-sm text-muted-foreground">
              Когда бот начнёт получать сообщения, метрики и графики появятся здесь.
            </p>
          </Card>
        ) : (
          <>
            {/* Charts grid */}
            <div className="grid lg:grid-cols-3 gap-5 mb-5">
              {/* Line: Messages per day */}
              <Card className="lg:col-span-2 p-6 rounded-2xl border-border bg-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold">Сообщения по дням</h3>
                    <p className="text-xs text-muted-foreground">Активность чата за неделю</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-tg/15 text-tg text-[10px] font-mono">line</span>
                </div>
                <div className="h-72">
                  {loading ? (
                    <Skeleton className="h-full w-full rounded-xl" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={perDay} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <defs>
                          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--accent))" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "3 3" }} />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="url(#lineGrad)"
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--primary))", r: 4, strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: "hsl(var(--accent))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>

              {/* Pie: Action types */}
              <Card className="p-6 rounded-2xl border-border bg-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold">Типы действий</h3>
                    <p className="text-xs text-muted-foreground">Распределение по категориям</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-accent/15 text-accent text-[10px] font-mono">pie</span>
                </div>
                <div className="h-72">
                  {loading ? (
                    <Skeleton className="h-full w-full rounded-xl" />
                  ) : actionDist.length === 0 ? (
                    <div className="h-full grid place-items-center text-sm text-muted-foreground">
                      Нет действий за период
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={actionDist}
                          cx="50%" cy="50%"
                          innerRadius={55}
                          outerRadius={95}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="hsl(var(--card))"
                          strokeWidth={3}
                        >
                          {actionDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend
                          iconType="circle"
                          wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>
            </div>

            {/* Recent activity */}
            <Card className="p-6 rounded-2xl border-border bg-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-lg font-semibold">Последние сообщения</h3>
                  <p className="text-xs text-muted-foreground">10 свежих записей</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-[10px] font-mono">live</span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : recent.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Нет сообщений
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {recent.map(m => (
                    <li key={m.id} className="py-3 flex items-center gap-4">
                      <div className={`h-9 w-9 rounded-xl bg-secondary grid place-items-center shrink-0 ${m.type === "voice" ? "text-accent" : "text-tg"}`}>
                        {m.type === "voice" ? <Mic className="h-4 w-4" /> : <Type className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm truncate">
                          {m.content || <span className="text-muted-foreground italic">без текста</span>}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          @{m.telegram_id} · {timeAgo(m.created_at)}
                        </p>
                      </div>
                      {m.action && (
                        <span className="px-2.5 py-1 rounded-full bg-secondary text-[10px] font-mono text-muted-foreground shrink-0 inline-flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {m.action}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
