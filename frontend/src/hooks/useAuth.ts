// src/hooks/useAuth.ts
import { useState } from "react";
import axios from "axios";

export default function useAuth() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = async () => {
    const { data } = await axios.post(
      "/auth/login",
      { email: loginEmail, password: loginPassword },
      { baseURL: "http://localhost:3000" }
    );
    localStorage.setItem("token", data.token);
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  const handleRegister = async () => {
    const { data } = await axios.post(
      "/auth/register",
      { email: loginEmail, password: loginPassword, name: "User" },
      { baseURL: "http://localhost:3000" }
    );
    localStorage.setItem("token", data.token);
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return {
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    isLoggedIn,
    authMode,
    setAuthMode,
    showAuthModal,
    setShowAuthModal,
    handleLogin,
    handleRegister,
    handleLogout,
  };
}
