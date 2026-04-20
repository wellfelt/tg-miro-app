import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { UserPlus, Link2, MessageSquare, Mic, ArrowDown, TrendingDown } from "lucide-react";

const stages = [
  { icon: UserPlus,     label: "Регистрация",          users: 1000, color: "from-tg/30 to-tg/5",       iconColor: "text-tg" },
  { icon: Link2,        label: "Подключили доску",     users: 720,  color: "from-primary/30 to-primary/5", iconColor: "text-primary" },
  { icon: MessageSquare,label: "Первое сообщение",     users: 540,  color: "from-accent/30 to-accent/5",   iconColor: "text-accent" },
  { icon: Mic,          label: "Использовали голос",   users: 312,  color: "from-success/30 to-success/5", iconColor: "text-success" },
];

const Funnel = () => {
  const max = stages[0].users;

  return (
    <div className="app-dark min-h-screen bg-background text-foreground">
      <Navbar variant="dark" />

      <div className="container py-10 max-w-4xl">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">Воронка</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Путь пользователя</h1>
          <p className="text-muted-foreground">От регистрации до первой голосовой команды</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <Card className="p-5 rounded-2xl border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Конверсия общая</p>
            <p className="font-display text-3xl font-bold text-success">31.2%</p>
          </Card>
          <Card className="p-5 rounded-2xl border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Активаций / день</p>
            <p className="font-display text-3xl font-bold">44</p>
          </Card>
          <Card className="p-5 rounded-2xl border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Drop-off худший</p>
            <p className="font-display text-3xl font-bold text-accent">шаг 3</p>
          </Card>
        </div>

        {/* Funnel stages */}
        <div className="space-y-3">
          {stages.map((s, i) => {
            const pct = (s.users / max) * 100;
            const conv = i === 0 ? 100 : Math.round((s.users / stages[i - 1].users) * 100);
            const drop = i === 0 ? 0 : 100 - conv;

            return (
              <div key={s.label}>
                <Card
                  className={`relative p-6 rounded-2xl border-border bg-gradient-to-r ${s.color} overflow-hidden hover:shadow-elegant transition-all`}
                  style={{ width: `${Math.max(pct, 35)}%` }}
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`h-12 w-12 rounded-xl bg-card grid place-items-center ${s.iconColor} shrink-0`}>
                        <s.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">этап {i + 1}</p>
                        <h3 className="font-display text-xl font-bold truncate">{s.label}</h3>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-3xl font-bold">{s.users.toLocaleString("ru")}</p>
                      <p className="text-xs text-muted-foreground">{conv}% от пред.</p>
                    </div>
                  </div>
                </Card>

                {i < stages.length - 1 && (
                  <div className="flex items-center gap-3 my-2 ml-6 text-xs text-muted-foreground">
                    <ArrowDown className="h-4 w-4" />
                    <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                    <span className="font-mono">−{drop}% drop-off · теряем {(stages[i].users - stages[i+1].users).toLocaleString("ru")} чел.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Card className="mt-10 p-6 rounded-2xl border-border bg-card">
          <h3 className="font-display text-lg font-semibold mb-2">💡 Идея гипотезы</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Самый большой провал — между подключением доски и первым сообщением. Возможно, стоит добавить onboarding-чат с примерами команд или предложить готовый шаблон сразу после подключения Miro.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Funnel;
