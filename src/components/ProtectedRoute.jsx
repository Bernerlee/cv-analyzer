import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        }}
      >
        <p className="text-white text-lg">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
