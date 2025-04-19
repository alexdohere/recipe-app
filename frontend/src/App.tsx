import React from "react";
import "./App.css";
import Spinner from "./Spinner";

import Header from "./components/Header";
import AuthModal from "./components/AuthModal";
import IngredientFilter from "./components/IngredientFilter";
import RecipeCard from "./components/RecipeCard";
import RecipeDetailsModal from "./components/RecipeDetailsModal";
import FavoritesModal from "./components/FavoritesModal";

import useAuth from "./hooks/useAuth";
import useRecipes from "./hooks/useRecipes";
import useFavorites from "./hooks/useFavorites";

import {
  stripHtmlTags,
  getWeatherDescription,
  getRandomMoodMessage,
  getBackgroundClass,
} from "./utils";

const App: React.FC = () => {
  const auth = useAuth();
  const rec = useRecipes();
  const fav = useFavorites();

  return (
    <div
      className={`App ${
        rec.weatherData ? getBackgroundClass(rec.weatherData.condition) : ""
      }`}
    >
      <Header
        isLoggedIn={auth.isLoggedIn}
        onLoginClick={() => auth.setShowAuthModal(true)}
        onRegisterClick={() => auth.setShowAuthModal(true)}
        onLogout={() => {
          auth.handleLogout();
          rec.resetAll();
        }}
        onShowFavorites={fav.fetchFavorites}
        showFavButton={auth.isLoggedIn}
        onHome={() => rec.resetAll()}
      />

      <AuthModal
        show={auth.showAuthModal}
        mode={auth.authMode}
        email={auth.loginEmail}
        password={auth.loginPassword}
        loading={rec.loading}
        error={rec.error}
        onEmailChange={auth.setLoginEmail}
        onPasswordChange={auth.setLoginPassword}
        onClose={() => auth.setShowAuthModal(false)}
        onSubmit={
          auth.authMode === "login" ? auth.handleLogin : auth.handleRegister
        }
      />

      <main className="content">
        {rec.loading && (
          <div className="loading">
            <Spinner />
            <p>Fetching recipes...</p>
          </div>
        )}

        {rec.step === "greeting" && (
          <div className="greeting">
            <p>Hey there! Feeling hungry?</p>
            <button
              className="button primary"
              onClick={rec.fetchWeatherRecipes}
            >
              Yes
            </button>
            <button
              className="button primary"
              onClick={() => rec.setStep("mood")}
            >
              No
            </button>
          </div>
        )}

        {rec.step === "weather" && rec.weatherData && (
          <div className="weather-info">
            <p>{stripHtmlTags(getWeatherDescription(rec.weatherData))}</p>
            <button
              className="button primary"
              onClick={() => rec.setStep("mood")}
            >
              Not in the mood? Choose something else!
            </button>
          </div>
        )}

        {rec.step === "mood" && (
          <div className="mood-selection">
            <p>{getRandomMoodMessage()}</p>
            <div className="mood-controls">
              <select
                className="select"
                value={rec.selectedMood}
                onChange={(e) => {
                  rec.setSelectedMood(e.target.value);
                  rec.handleMoodSelection(e.target.value);
                }}
              >
                <option value="">Select a mood</option>
                <option value="comfort food">Comforting & Warm</option>
                <option value="salad">Light & Fresh</option>
                <option value="pasta">Quick & Easy</option>
                <option value="curry">Something Exotic</option>
                <option value="random">Surprise Me!</option>
              </select>
              {rec.selectedMood && (
                <button
                  className="refresh-button"
                  title="Refresh recipes"
                  onClick={() => rec.handleMoodSelection(rec.selectedMood)}
                >
                  ↻
                </button>
              )}
            </div>
          </div>
        )}

        {rec.recipes.length > 0 && (
          <>
            <button
              className="button secondary"
              style={{ margin: "1rem" }}
              onClick={() => rec.setShowIngredientFilter((v) => !v)}
            >
              {rec.showIngredientFilter
                ? "Hide Ingredient Filter"
                : "Show Ingredient Filter"}
            </button>

            <IngredientFilter
              show={rec.showIngredientFilter}
              uniqueIngredients={rec.uniqueIngredients}
              selectedIngredients={rec.selectedIngredients}
              onToggle={() => rec.setShowIngredientFilter((v) => !v)}
              onChange={(ing, checked) =>
                rec.setSelectedIngredients((prev) =>
                  checked ? [...prev, ing] : prev.filter((x) => x !== ing)
                )
              }
            />

            <div
              className="recipes"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
              }}
            >
              {rec.filteredRecipes.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  onSelect={() => rec.setSelectedRecipe(r)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <FavoritesModal
        show={fav.showFavorites}
        favorites={fav.favorites}
        onClose={() => fav.setShowFavorites(false)}
        onSelect={(r) => {
          rec.setSelectedRecipe(r);
          fav.setShowFavorites(false);
        }}
      />

      <RecipeDetailsModal
        recipe={rec.selectedRecipe}
        onClose={() => rec.setSelectedRecipe(null)}
        onAddFavorite={fav.addFavorite}
        onDeleteFavorite={fav.deleteFavorite}
        isFavorite={fav.favorites.some((f) => f.id === rec.selectedRecipe?.id)}
        isLoggedIn={auth.isLoggedIn}
      />

      <footer className="app-footer">
        <p>2025 Weather Mood Food</p>
      </footer>
    </div>
  );
};

export default App;
