import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { TrendingDown, Users } from "lucide-react";

type FunnelRow = { stage: string; count: number; ord: number };
type DayRow = { day: string; count: number };
type UserRow = {
  id: string;
  email: string | null;
  username: string | null;
  role: "admin" | "user";
  telegram_id: number | null;
  board_id: string | null;
  created_at: string;
};

const WEEKDAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 12,
  fontSize: 12,
  color: "hsl(var(--foreground))",
};

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [funnel, setFunnel] = useState<FunnelRow[]>([]);
  const [perDay, setPerDay] = useState<DayRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const sb = supabase as unknown as {
        rpc: (fn: string) => Promise<{ data: unknown; error: unknown }>;
      };
      const [funnelRes, perDayRes, usersRes] = await Promise.all([
        sb.rpc("get_admin_funnel"),
        sb.rpc("get_messages_per_day"),
        supabase
          .from("profiles")
          .select("id, email, username, role, telegram_id, board_id, created_at")
          .order("created_at", { ascending: false }),
      ]);
      if (cancelled) return;
      if (Array.isArray(funnelRes.data)) {
        setFunnel((funnelRes.data as FunnelRow[]).map(r => ({ ...r, count: Number(r.count) })));
      }
      if (Array.isArray(perDayRes.data)) {
        setPerDay(
          (perDayRes.data as { day: string; count: number | string }[]).map(r => ({
            day: WEEKDAYS[new Date(r.day).getDay()],
            count: Number(r.count) || 0,
          }))
        );
      }
      if (usersRes.data) setUsers(usersRes.data as UserRow[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const max = funnel[0]?.count || 1;

  return (
    <div className="app-dark min-h-screen bg-background text-foreground">
      <Navbar variant="dark" />

      <div className="container py-10 max-w-5xl">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">Админ</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Панель управления</h1>
          <p className="text-muted-foreground mt-2">Аналитика и пользователи · реальные данные</p>
        </div>

        <Tabs defaultValue="analytics">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-5">
            {/* Funnel */}
            <Card className="p-6 rounded-2xl border-border bg-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-lg font-semibold">Воронка</h3>
                  <p className="text-xs text-muted-foreground">Путь пользователя</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-tg/15 text-tg text-[10px] font-mono">funnel</span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {funnel.map((s, i) => {
                    const pct = (s.count / max) * 100;
                    const conv = i === 0 ? 100 : funnel[i - 1].count
                      ? Math.round((s.count / funnel[i - 1].count) * 100) : 0;
                    const drop = i === 0 ? 0 : 100 - conv;
                    return (
                      <div key={s.stage}>
                        <Card
                          className="relative p-5 rounded-xl border-border bg-gradient-to-r from-primary/20 to-primary/5 overflow-hidden"
                          style={{ width: `${Math.max(pct, 35)}%` }}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                                этап {i + 1}
                              </p>
                              <h4 className="font-display text-lg font-bold">{s.stage}</h4>
                            </div>
                            <div className="text-right">
                              <p className="font-display text-2xl font-bold">{s.count.toLocaleString("ru")}</p>
                              <p className="text-xs text-muted-foreground">{conv}% от пред.</p>
                            </div>
                          </div>
                        </Card>
                        {i < funnel.length - 1 && drop > 0 && (
                          <div className="flex items-center gap-2 my-2 ml-5 text-xs text-muted-foreground">
                            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                            <span className="font-mono">−{drop}% drop-off</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Messages per day */}
            <Card className="p-6 rounded-2xl border-border bg-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-lg font-semibold">Сообщения по дням</h3>
                  <p className="text-xs text-muted-foreground">Последние 7 дней</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-accent/15 text-accent text-[10px] font-mono">bar</span>
              </div>
              <div className="h-72">
                {loading ? (
                  <Skeleton className="h-full w-full rounded-xl" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={perDay} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--secondary))" }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-6 rounded-2xl border-border bg-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-lg font-semibold">Все пользователи</h3>
                  <p className="text-xs text-muted-foreground">
                    {loading ? "загрузка…" : `Всего: ${users.length}`}
                  </p>
                </div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>

              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : users.length === 0 ? (
                <p className="text-sm text-muted-foreground py-10 text-center">
                  Пользователей пока нет
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Telegram ID</TableHead>
                        <TableHead>Board ID</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map(u => (
                        <TableRow key={u.id}>
                          <TableCell className="font-mono text-xs">{u.email ?? "—"}</TableCell>
                          <TableCell className="font-mono text-xs">{u.username ?? "—"}</TableCell>
                          <TableCell>
                            <Badge variant={u.role === "admin" ? "default" : "secondary"} className="text-[10px]">
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{u.telegram_id ?? "—"}</TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-[140px]">{u.board_id ?? "—"}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {new Date(u.created_at).toLocaleDateString("ru")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
