import { signInWithGoogle, signOutUser } from "../lib/auth";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();

  const handleLogin = async () => {
    const { error } = await signInWithGoogle();

    if (error) {
      console.error(error.message);
    }
  };

  const handleLogout = async () => {
    const { error } = await signOutUser();

    if (error) {
      console.error(error.message);
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
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#ec4899)",
          }}
        >
          CV
        </div>

        <span className="text-white font-bold text-xl">CVPilot</span>
      </div>

      {user ? (
        <div className="flex items-center gap-3">
          <img
            src={user.user_metadata.avatar_url}
            alt="avatar"
            className="w-9 h-9 rounded-full"
          />

          <span className="text-white hidden md:block">
            {user.user_metadata.full_name}
          </span>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-5 py-2 rounded-xl text-white font-semibold"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#ec4899)",
          }}
        >
          Sign in with Google
        </button>
      )}
    </nav>
  );
}
