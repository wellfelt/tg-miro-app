import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MessageSquare, Mic, Layers, ArrowRight, Sparkles, Send, Square, Sticker } from "lucide-react";
import heroImg from "@/assets/hero.jpg";

const features = [
  {
    icon: MessageSquare,
    title: "Команды текстом",
    desc: "Пиши в Telegram-бот: «добавь стикер „идея запуска“ в правый верх» — и наблюдай, как меняется доска.",
    color: "from-tg/20 to-tg/5",
    iconBg: "bg-tg/15 text-tg",
  },
  {
    icon: Mic,
    title: "Голосовые в действия",
    desc: "Запиши голосовое — AI распознаёт замысел и расставляет блоки, стрелки и группы за тебя.",
    color: "from-accent/20 to-accent/5",
    iconBg: "bg-accent/15 text-accent",
  },
  {
    icon: Layers,
    title: "Шаблоны на лету",
    desc: "«Сделай SWOT по нашему проекту» — бот соберёт каркас, разложит идеи и подсветит главное.",
    color: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/15 text-primary",
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
              Бета · работает с любой Miro-доской
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
              Управляй <span className="text-gradient">Miro</span><br />
              из <span className="inline-flex items-center gap-2">
                <span className="text-tg">Telegram</span>
                <Send className="h-10 w-10 md:h-14 md:w-14 text-tg -rotate-12 animate-float" />
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Голосом или текстом меняй доску, не открывая браузер. Идеи летят быстрее мысли — прямо из чата.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="xl" variant="hero">
                <Link to="/login">
                  Начать <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to="/app">Посмотреть демо</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full bg-brand border-2 border-background" style={{opacity: 0.4 + i*0.15}} />
                ))}
              </div>
              <span>+1 240 команд используют ежедневно</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-brand opacity-20 blur-3xl rounded-full" />
            <img
              src={heroImg}
              alt="Telegram превращается в Miro доску — иллюстрация интеграции"
              width={1536}
              height={1024}
              className="relative rounded-2xl shadow-elegant w-full"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 md:py-28">
        <div className="max-w-2xl mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">Что умеет</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Три способа <br />двигать доску из чата
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Card
              key={f.title}
              className={`relative p-7 rounded-2xl border-border bg-gradient-to-br ${f.color} hover:-translate-y-1 transition-all duration-500 hover:shadow-elegant group overflow-hidden`}
            >
              <div className={`h-12 w-12 rounded-xl ${f.iconBg} grid place-items-center mb-5`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              <span className="absolute top-5 right-5 font-mono text-xs text-muted-foreground/50">0{i+1}</span>
            </Card>
          ))}
        </div>
      </section>

      {/* Demo block */}
      <section className="container pb-20 md:pb-28">
        <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-soft">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">Демо</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Сказал в чат — увидел на доске
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Команды попадают в очередь, бот отвечает кратко, а изменения отображаются в реальном времени. Никаких сложных интерфейсов.
              </p>
              <div className="space-y-3">
                {[
                  { who: "Ты", text: "Создай 4 стикера: цели, риски, ресурсы, дедлайны", side: "right" },
                  { who: "Бот", text: "Готово. Расположил по углам, подсветил «риски» жёлтым.", side: "left" },
                ].map((m, i) => (
                  <div key={i} className={`flex ${m.side === "right" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      m.side === "right"
                        ? "bg-brand text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    }`}>
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
              <Link to="/login">
                Подключить бота <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 tg×miro · Сделано с любовью к доскам</p>
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
