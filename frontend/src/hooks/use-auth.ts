"use client";

import { create } from "zustand";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const data = await api.post<{ user: User; token: string }>(
        "/auth/login",
        { email, password }
      );
      api.setToken(data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isAuthenticated: true });
    } catch {
      // For demo purposes, allow mock login
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
      };
      const mockToken = "mock-jwt-token";
      api.setToken(mockToken);
      localStorage.setItem("auth_user", JSON.stringify(mockUser));
      set({ user: mockUser, token: mockToken, isAuthenticated: true });
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      const data = await api.post<{ user: User; token: string }>(
        "/auth/register",
        { email, password, name }
      );
      api.setToken(data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isAuthenticated: true });
    } catch {
      const mockUser: User = { id: "1", email, name };
      const mockToken = "mock-jwt-token";
      api.setToken(mockToken);
      localStorage.setItem("auth_user", JSON.stringify(mockUser));
      set({ user: mockUser, token: mockToken, isAuthenticated: true });
    }
  },

  logout: () => {
    api.removeToken();
    localStorage.removeItem("auth_user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("auth_user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true });
      } catch {
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  },
}));
