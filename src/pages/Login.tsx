import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Введите корректный email");
      return;
    }
    setSent(true);
    toast.success("Магическая ссылка отправлена ✨");
  };

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <Navbar />

      <div className="container py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center max-w-5xl">
        {/* Left brand */}
        <div className="hidden md:block">
          <Link to="/"><Logo /></Link>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mt-8 mb-4 leading-tight">
            Один вход —<br />и доска <span className="text-gradient">в кармане</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Получи магическую ссылку на почту. Никаких паролей, никакой регистрации.
          </p>
          <ul className="space-y-3">
            {["Безопасный вход через email", "Подключение Telegram за 1 клик", "Любая публичная Miro-доска"].map(t => (
              <li key={t} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-success" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <Card className="p-8 md:p-10 rounded-2xl shadow-elegant border-border">
          {!sent ? (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-medium mb-6">
                <Sparkles className="h-3 w-3 text-accent" /> Magic Link
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">С возвращением</h2>
              <p className="text-muted-foreground text-sm mb-8">Введи email — мы вышлем ссылку для входа.</p>

              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="ты@почта.рф"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-xl"
                      autoFocus
                    />
                  </div>
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Отправить ссылку <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground font-mono">или</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => { toast.success("Демо-вход"); navigate("/app"); }}
              >
                Пропустить и зайти в демо
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-6">
                Продолжая, ты соглашаешься с условиями. Auth подключим позже.
              </p>
            </>
          ) : (
            <div className="text-center py-8 animate-slide-up">
              <div className="h-16 w-16 rounded-full bg-success/15 grid place-items-center mx-auto mb-6">
                <Mail className="h-7 w-7 text-success" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">Проверь почту</h2>
              <p className="text-muted-foreground mb-8">
                Отправили ссылку на <span className="text-foreground font-medium">{email}</span>
              </p>
              <Button variant="brand" size="lg" className="w-full" onClick={() => navigate("/app")}>
                Перейти в чат (демо)
              </Button>
              <button
                className="mt-4 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setSent(false)}
              >
                ← Использовать другой email
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Login;
