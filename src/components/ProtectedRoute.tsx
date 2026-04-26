import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Loading = () => (
  <div className="min-h-screen grid place-items-center bg-background">
    <div className="text-sm text-muted-foreground font-mono">загрузка…</div>
  </div>
);

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isAdmin, loading, profile } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  // Wait until profile resolved before deciding
  if (profile === null) return <Loading />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};
