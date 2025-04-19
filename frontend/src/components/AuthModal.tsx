import React from "react";

interface Props {
  show: boolean;
  mode: "login" | "register";
  email: string;
  password: string;
  loading: boolean;
  error: string;
  onEmailChange(v: string): void;
  onPasswordChange(v: string): void;
  onClose(): void;
  onSubmit(): void;
}

export default function AuthModal({
  show,
  mode,
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onClose,
  onSubmit,
}: Props) {
  if (!show) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>{mode === "login" ? "Login" : "Register"}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
        <button
          className="button primary"
          onClick={onSubmit}
          disabled={loading}
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
