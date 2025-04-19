import React from "react";

interface Props {
  isLoggedIn: boolean;
  onLoginClick(): void;
  onRegisterClick(): void;
  onLogout(): void;
  onShowFavorites(): void;
  showFavButton: boolean;
  onHome(): void;
}

export default function Header({
  isLoggedIn,
  onLoginClick,
  onRegisterClick,
  onLogout,
  onShowFavorites,
  showFavButton,
  onHome,
}: Props) {
  return (
    <header className="app-header">
      <div className="auth-controls">
        {!isLoggedIn ? (
          <>
            <button className="button auth-button" onClick={onLoginClick}>
              Login
            </button>
            <button className="button auth-button" onClick={onRegisterClick}>
              Register
            </button>
          </>
        ) : (
          <button className="button auth-button" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
      <h1 style={{ cursor: "pointer" }} onClick={onHome}>
        Weather Mood Food
      </h1>
      <p>Your personalized recipe suggestions</p>
      {isLoggedIn && showFavButton && (
        <button className="button secondary" onClick={onShowFavorites}>
          Show Favorites
        </button>
      )}
    </header>
  );
}
