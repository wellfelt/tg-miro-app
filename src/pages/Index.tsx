import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  MessageSquare, Mic, Layers, ArrowRight, Sparkles, Send,
  StickyNote, Workflow, Network, Eye, Frame,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";

const TELEGRAM_BOT_URL = "https://t.me/miro_wfl_bot";

const features = [
  {
    icon: StickyNote,
    title: "Стикеры",
    desc: "«Добавь жёлтый стикер „идея запуска“ в правый верх» — и наблюдай, как доска оживает.",
    iconBg: "bg-tg/15 text-tg",
    grad: "from-tg/15 to-tg/0",
  },
  {
    icon: Workflow,
    title: "Блок-схемы",
    desc: "Опиши процесс словами — бот соберёт прямоугольники, ромбы и стрелки в правильном порядке.",
    iconBg: "bg-primary/15 text-primary",
    grad: "from-primary/15 to-primary/0",
  },
  {
    icon: Network,
    title: "Майндмапы",
    desc: "«Раскрой тему „онбординг“ на 3 уровня» — получи готовую структуру с ветками и подузлами.",
    iconBg: "bg-accent/15 text-accent",
    grad: "from-accent/15 to-accent/0",
  },
  {
    icon: Mic,
    title: "Голосовой ввод",
    desc: "Запиши голосовое — AI распознаёт замысел и расставляет блоки за тебя. Без рук.",
    iconBg: "bg-success/15 text-success",
    grad: "from-success/15 to-success/0",
  },
  {
    icon: Eye,
    title: "Анализ доски",
    desc: "«Что у меня на доске?» — бот суммирует содержимое, находит дубли и подсветит главное.",
    iconBg: "bg-primary/15 text-primary",
    grad: "from-primary/15 to-primary/0",
  },
  {
    icon: Frame,
    title: "Фреймы",
    desc: "Группируй идеи в фреймы и секции одной командой. Идеально для воркшопов и ретро.",
    iconBg: "bg-tg/15 text-tg",
    grad: "from-tg/15 to-tg/0",
  },
];

const steps = [
  {
    n: "01",
    title: "Подключи бота",
    desc: "Открой @miro_wfl_bot в Telegram и пришли ссылку на свою Miro-доску. 30 секунд на старт.",
    icon: Send,
  },
  {
    n: "02",
    title: "Скажи или напиши",
    desc: "Отправляй текст или голос: «добавь стикер», «нарисуй процесс», «собери майндмап».",
    icon: MessageSquare,
  },
  {
    n: "03",
    title: "Смотри, как меняется доска",
    desc: "Изменения появляются в реальном времени. Бот отвечает кратко, без болтовни.",
    icon: Layers,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-80 pointer-events-none" />
        <div className="container relative pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium text-muted-foreground mb-6 shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Miro AI Bot · бета
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] mb-6">
              Управляй <span className="text-gradient">Miro-доской</span> голосом и текстом через{" "}
              <span className="inline-flex items-center gap-2">
                <span className="text-tg">Telegram</span>
                <Send className="h-9 w-9 md:h-12 md:w-12 text-tg -rotate-12 animate-float" />
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Создавай стикеры, блок-схемы и майндмапы прямо из чата. Голосом или текстом — без браузера и мышки.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="xl" variant="hero">
                <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">
                  Попробовать бесплатно <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-brand opacity-20 blur-3xl rounded-full" />
            <img
              src={heroImg}
              alt="Miro AI Bot — управление доской из Telegram"
              width={1536}
              height={1024}
              className="relative rounded-2xl shadow-elegant w-full"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Features — 6 cards */}
      <section className="container py-20 md:py-28">
        <div className="max-w-2xl mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">Возможности</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Шесть инструментов, <br />одно сообщение
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Card
              key={f.title}
              className={`relative p-7 rounded-2xl border-border bg-gradient-to-br ${f.grad} hover:-translate-y-1 transition-all duration-500 hover:shadow-elegant group overflow-hidden`}
            >
              <div className={`h-12 w-12 rounded-xl ${f.iconBg} grid place-items-center mb-5`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              <span className="absolute top-5 right-5 font-mono text-xs text-muted-foreground/50">
                0{i + 1}
              </span>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works — 3 steps */}
      <section className="relative overflow-hidden border-y border-border bg-secondary/30">
        <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-2xl mb-14">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">Как это работает</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              Три шага <br />до первой доски
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <Card className="p-7 rounded-2xl border-border bg-card h-full hover:shadow-elegant transition-shadow">
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-12 w-12 rounded-xl bg-brand grid place-items-center text-primary-foreground">
                      <s.icon className="h-6 w-6" />
                    </div>
                    <span className="font-display text-4xl font-bold text-muted-foreground/30">
                      {s.n}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </Card>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 h-6 w-6 text-muted-foreground/40 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo block */}
      <section className="container py-20 md:py-28">
        <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-soft">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">Демо</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Сказал в чат — увидел на доске
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Команды попадают в очередь, бот отвечает кратко, изменения видны в реальном времени.
              </p>
              <div className="space-y-3">
                {[
                  { who: "Ты", text: "Создай 4 стикера: цели, риски, ресурсы, дедлайны", side: "right" },
                  { who: "Бот", text: "Готово. Расположил по углам, подсветил «риски» жёлтым.", side: "left" },
                ].map((m, i) => (
                  <div key={i} className={`flex ${m.side === "right" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                        m.side === "right"
                          ? "bg-brand text-primary-foreground rounded-br-sm"
                          : "bg-secondary text-foreground rounded-bl-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative bg-secondary/50 ring-grid p-8 min-h-[360px] flex items-center justify-center">
              <div className="absolute top-4 left-4 flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
              </div>
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                {[
                  { c: "bg-yellow-200", t: "Цели", r: "rotate-[-3deg]" },
                  { c: "bg-rose-200", t: "Риски", r: "rotate-[2deg]" },
                  { c: "bg-blue-200", t: "Ресурсы", r: "rotate-[3deg]" },
                  { c: "bg-emerald-200", t: "Дедлайны", r: "rotate-[-2deg]" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`${s.c} ${s.r} aspect-square p-4 rounded-md shadow-md font-display font-semibold text-foreground/80 grid place-items-center text-center hover:rotate-0 transition-transform`}
                  >
                    {s.t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative rounded-2xl overflow-hidden bg-brand p-12 md:p-16 text-center shadow-elegant">
          <div className="absolute inset-0 bg-mesh opacity-30" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Готов попробовать?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              30 секунд на подключение. Никаких настроек — только Telegram и доска.
            </p>
            <Button asChild size="xl" variant="accent" className="animate-pulse-glow">
              <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">
                Попробовать бесплатно <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 Miro AI Bot · Сделано с любовью к доскам</p>
          <div className="flex gap-6">
            <Link to="/dashboard" className="hover:text-foreground">Метрики</Link>
            <Link to="/funnel" className="hover:text-foreground">Воронка</Link>
            <Link to="/app" className="hover:text-foreground">Чат</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
