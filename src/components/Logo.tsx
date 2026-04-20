import { Send } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative h-8 w-8 rounded-xl bg-brand grid place-items-center shadow-soft">
      <Send className="h-4 w-4 text-primary-foreground -rotate-12" strokeWidth={2.5} />
      <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-accent border-2 border-background" />
    </div>
    <span className="font-display font-bold text-lg tracking-tight">
      tg<span className="text-gradient">×</span>miro
    </span>
  </div>
);
