import { createContext, ReactNode, useEffect, useState } from "react";
import {
  auth,
  authLogin,
  authLogout,
  authProvider,
  onAuthStateChanged,
} from "../services/firebase";

interface User {
  id: string;
  name: string;
  avatar?: string | null;
}

interface AuthContextProps {
  user?: User;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  async function signInWithGoogle() {
    const result = await authLogin(auth, authProvider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      setUser({
        id: uid,
        name: displayName || "Usuário",
        avatar: photoURL,
      });
    }
  }

  async function signOut() {
    await authLogout(auth);
    setUser(undefined);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        setUser({
          id: uid,
          name: displayName || "Usuário",
          avatar: photoURL,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
