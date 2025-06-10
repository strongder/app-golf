"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api"; // Adjust the import path as necessary

interface AuthContextType {
  user: any | null;
  loading: boolean;
  isFirstTime: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    phone?: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  getMe: () => Promise<any | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      if (userData) {
        setUser(JSON.parse(userData));
      }

      if (hasSeenOnboarding) {
        setIsFirstTime(false);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      const { token } = response.data;
      await AsyncStorage.setItem("token", token);

      const meResponse = await api.get("/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = meResponse.data.data;
      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
  ;
      return true;
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phone?: string
  ): Promise<boolean> => {
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        name,
        phone,
      });

      const { token } = response.data;
      await AsyncStorage.setItem("token", token);

      const meResponse = await api.get("/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = meResponse.data.data;
      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  // Khi hoàn thành onboarding, chuyển sang login
  const completeOnboarding = async () => {
    setIsFirstTime(false);
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
  };

  const getMe = async (): Promise<any | null> => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return null;

      const response = await api.get("/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data.data;
      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Lỗi khi lấy user từ token:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirstTime,
        login,
        register,
        logout,
        completeOnboarding,
        getMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
