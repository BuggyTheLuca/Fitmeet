import { createContext, ReactNode, useEffect, useState, useMemo } from "react";
import { LoggedUser } from "../types/user";

interface ProviderProps {
  children: ReactNode;
}

interface LoggedUserContextType {
  loggedUser: LoggedUser | null;
  setLoggedUser: (user: LoggedUser | null) => void;
  loading: boolean;
}

const AuthContext = createContext<LoggedUserContextType | null>(null);

function AuthProvider({ children }: ProviderProps) {
  const [loggedUser, setData] = useState<LoggedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("logged-user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.token = "Bearer " + user.token;
      setData(user);
    }

    setLoading(false);
  }, []);

  const setLoggedUser = (user: LoggedUser | null) => {
    setData(user);

    if (user) {
      sessionStorage.setItem("logged-user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("logged-user");
    }
  };

  const value = useMemo(() => ({
    loggedUser,
    setLoggedUser,
    loading,
  }), [loggedUser, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
