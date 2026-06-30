import { auth, provider } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <nav
      className="flex items-center justify-between px-8 py-4"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
          }}
        >
          CV
        </div>

        <span className="text-white font-bold text-lg">CVAnalyzer</span>
      </div>

      {/* Authentication */}
      <div>
        {loading ? (
          <div className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            Loading...
          </div>
        ) : user ? (
          <div className="flex items-center gap-3">
            <img
              src={user?.photoURL}
              alt={user?.displayName}
              className="w-9 h-9 rounded-full"
              style={{
                border: "2px solid rgba(167,139,250,0.6)",
              }}
            />

            <span
              className="hidden md:block text-sm font-medium"
              style={{
                color: "rgba(255,255,255,0.75)",
              }}
            >
              {user?.displayName}
            </span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-80 cursor-pointer"
              style={{
                color: "#f472b6",
                border: "1px solid rgba(244,114,182,0.3)",
                background: "rgba(244,114,182,0.1)",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              boxShadow: "0 0 20px rgba(124,58,237,0.3)",
            }}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-4 h-4"
            />
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
}
