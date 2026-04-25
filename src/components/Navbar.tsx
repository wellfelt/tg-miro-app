import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const authedLinks = [
  { to: "/dashboard", label: "Дашборд" },
  { to: "/chat", label: "Чат" },
  { to: "/funnel", label: "Воронка" },
];

export const Navbar = ({ variant = "light" }: { variant?: "light" | "dark" }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success("Вы вышли");
    navigate("/", { replace: true });
    setOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 backdrop-blur-xl border-b",
        variant === "light"
          ? "bg-background/70 border-border"
          : "bg-background/60 border-border"
      )}
    >
      <nav className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {user && authedLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                pathname === l.to
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-xs text-muted-foreground font-mono max-w-[180px] truncate">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Выйти
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Войти</Link>
              </Button>
              <Button asChild variant="brand" size="sm">
                <Link to="/login">Начать</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-1">
            {user && authedLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium",
                  pathname === l.to ? "bg-secondary" : "hover:bg-secondary/60"
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              {user ? (
                <Button variant="outline" className="flex-1" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" /> Выйти
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" className="flex-1">
                    <Link to="/login" onClick={() => setOpen(false)}>Войти</Link>
                  </Button>
                  <Button asChild variant="brand" className="flex-1">
                    <Link to="/login" onClick={() => setOpen(false)}>Начать</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
