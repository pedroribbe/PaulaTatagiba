import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { logout as apiLogout } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [logged, setLogged]   = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setLogged(!!user);
      setLoading(false);
    });
    return unsub;
  }, []);

  // signIn é no-op: o estado é atualizado automaticamente pelo onAuthStateChanged
  const signIn  = useCallback(() => {}, []);
  const signOut = useCallback(() => apiLogout(), []);

  return (
    <AuthContext.Provider value={{ logged, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
