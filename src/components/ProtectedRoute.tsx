import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-sm text-muted-foreground font-mono">загрузка…</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
};
