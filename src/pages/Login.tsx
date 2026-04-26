import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Mail, Lock, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { track } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();
  const { user, isAdmin, profile, loading } = useAuth();

  // If already authenticated, route by role
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    // Wait until profile resolved so we can route correctly
    if (profile === null) return;
    navigate(isAdmin ? "/admin" : "/dashboard", { replace: true });
  }, [user, profile, isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Введите корректный email");
      return;
    }
    if (password.length < 6) {
      toast.error("Пароль должен быть не короче 6 символов");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        track("signup_started", { method: "password", email_domain: email.split("@")[1] ?? null });
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) {
          if (error.message.toLowerCase().includes("already")) {
            toast.error("Такой email уже зарегистрирован — войди");
            setMode("signin");
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success("Аккаунт создан ✨");
        // Effect above will redirect once profile loads
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast.error(error.message === "Invalid login credentials"
            ? "Неверный email или пароль"
            : error.message);
          return;
        }
        toast.success("С возвращением 👋");
        // Effect above will redirect once profile loads
      }
    } finally {
      setLoading(false);
    }
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
            Email и пароль — никакой лишней магии. Создай аккаунт за 10 секунд.
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
          <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")}>
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="signin">Войти</TabsTrigger>
              <TabsTrigger value="signup">Создать аккаунт</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-0">
              <h2 className="font-display text-2xl font-bold mb-2">С возвращением</h2>
              <p className="text-muted-foreground text-sm mb-6">Войди по email и паролю.</p>
            </TabsContent>
            <TabsContent value="signup" className="mt-0">
              <h2 className="font-display text-2xl font-bold mb-2">Создай аккаунт</h2>
              <p className="text-muted-foreground text-sm mb-6">Email и пароль — этого достаточно.</p>
            </TabsContent>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="минимум 6 символов"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {mode === "signup" ? "Создать аккаунт" : "Войти"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Продолжая, ты соглашаешься с условиями.
            </p>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
