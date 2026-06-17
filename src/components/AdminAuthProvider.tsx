"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { isAuthenticated, login as authLogin, logout as authLogout } from "@/lib/auth";

interface AdminAuthContextType {
  isLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    const success = authLogin(password);
    if (success) {
      setIsLoggedIn(true);
    }
    return success;
  };

  const logout = () => {
    authLogout();
    setIsLoggedIn(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isLoggedIn, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
