import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from "recharts";
import { MessageSquare, Mic, Activity, TrendingUp } from "lucide-react";

const messagesPerDay = [
  { day: "Пн", count: 124 }, { day: "Вт", count: 168 }, { day: "Ср", count: 142 },
  { day: "Чт", count: 215 }, { day: "Пт", count: 287 }, { day: "Сб", count: 102 }, { day: "Вс", count: 88 },
];

const voiceVsText = [
  { name: "Текст", value: 712 },
  { name: "Голос", value: 414 },
];
const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--accent))"];

const actionTypes = [
  { type: "create_sticker", count: 312 },
  { type: "create_arrow",   count: 178 },
  { type: "create_frame",   count: 94  },
  { type: "color_change",   count: 142 },
  { type: "delete",         count: 56  },
  { type: "move",           count: 88  },
];

const stats = [
  { icon: MessageSquare, label: "Сообщений за неделю", value: "1 126", trend: "+18%", color: "text-tg" },
  { icon: Mic,           label: "Голосовых",            value: "414",   trend: "+34%", color: "text-accent" },
  { icon: Activity,      label: "Действий на доске",    value: "870",   trend: "+22%", color: "text-primary" },
  { icon: TrendingUp,    label: "Активные пользователи",value: "237",   trend: "+12%", color: "text-success" },
];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 12,
  fontSize: 12,
  color: "hsl(var(--foreground))",
};

const Dashboard = () => {
  return (
    <div className="app-dark min-h-screen bg-background text-foreground">
      <Navbar variant="dark" />

      <div className="container py-10">
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">Аналитика</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold">Метрики бота</h1>
            <p className="text-muted-foreground mt-2">Последние 7 дней · демо-данные</p>
          </div>
          <div className="px-4 py-2 rounded-full bg-secondary text-xs font-mono text-muted-foreground">
            обновлено 2 мин назад
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
                <span className="text-xs font-mono text-success">{s.trend}</span>
              </div>
              <p className="font-display text-3xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Charts grid */}
        <div className="grid lg:grid-cols-3 gap-5">
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
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={messagesPerDay} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
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
            </div>
          </Card>

          {/* Pie: Voice vs Text */}
          <Card className="p-6 rounded-2xl border-border bg-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-lg font-semibold">Голос vs Текст</h3>
                <p className="text-xs text-muted-foreground">Доля типов сообщений</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-accent/15 text-accent text-[10px] font-mono">pie</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={voiceVsText}
                    cx="50%" cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="hsl(var(--card))"
                    strokeWidth={3}
                  >
                    {voiceVsText.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Bar: Action types */}
          <Card className="lg:col-span-3 p-6 rounded-2xl border-border bg-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-lg font-semibold">Типы действий на доске</h3>
                <p className="text-xs text-muted-foreground">Что бот делает чаще всего</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-[10px] font-mono">bar</span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={actionTypes} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--primary) / 0.08)" }} />
                  <Bar dataKey="count" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
