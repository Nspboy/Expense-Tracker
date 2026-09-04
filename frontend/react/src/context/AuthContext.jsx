import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loading, setLoading] = useState(true);

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setProfile(null);
  }, []);

  const fetchProfile = React.useCallback(async () => {
    try {
      const res = await api.get("profile/me/");
      setProfile(res.data);
      if (res.data.theme) {
        setTheme(res.data.theme);
      }
    } catch (e) {
      console.error("Error fetching profile", e);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          fetchProfile();
        } else {
          handleLogout();
        }
      } catch {
        handleLogout();
      }
    }
    setLoading(false);
  }, [fetchProfile, handleLogout]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogin = async (username, password) => {
    const res = await api.post("token/", { username, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    const decoded = jwtDecode(res.data.access);
    setUser(decoded);
    await fetchProfile();
    return res.data;
  };

  const updateProfile = async (data) => {
    const res = await api.patch("profile/me/", data);
    setProfile(res.data);
    if (data.theme) {
      setTheme(data.theme);
    }
    return res.data;
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (profile) {
      updateProfile({ theme: newTheme });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        theme,
        loading,
        handleLogin,
        handleLogout,
        updateProfile,
        toggleTheme,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
