import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, loading, error] = useAuthState(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
