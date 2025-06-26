// components/ProtectedRoute.tsx
import { useContext, type JSX } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token , isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
