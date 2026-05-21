import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/types";
import { MOCK_USERS } from "@/lib/data";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  company?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("spacebility_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("spacebility_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      localStorage.setItem("spacebility_user", JSON.stringify(found));
      setIsLoading(false);
      return { success: true };
    }
    // Allow any valid email format to login as freelancer
    if (email.includes("@") && email.includes(".")) {
      const newUser: User = {
        id: "u_new",
        name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        role: "freelancer",
        plan: "free",
        joinedAt: new Date().toISOString().split("T")[0],
        verified: true,
      };
      setUser(newUser);
      localStorage.setItem("spacebility_user", JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, error: "Invalid email or password. Please try again." };
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      plan: "free",
      joinedAt: new Date().toISOString().split("T")[0],
      company: data.company,
      verified: false,
    };
    setUser(newUser);
    localStorage.setItem("spacebility_user", JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("spacebility_user");
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("spacebility_user", JSON.stringify(updated));
  };

  const switchRole = (_role: string) => {}; // removed — kept for any legacy references

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
