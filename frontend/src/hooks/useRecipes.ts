import { useState, useEffect } from "react";
import axios from "axios";
import { Recipe, Ingredient, WeatherData } from "../types";
import { shuffle } from "../utils";

type Step = "greeting" | "weather" | "mood";

export default function useRecipes() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("greeting");
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );

  // **NEW** selectedRecipe state + setter
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const [selectedMood, setSelectedMood] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [showIngredientFilter, setShowIngredientFilter] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) =>
        setLocation({ lat: coords.latitude, lon: coords.longitude }),
      () => setError("Location blocked; please enter manually.")
    );
  }, []);

  const fetchWeatherRecipes = async () => {
    if (!location) return setError("Location missing");
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/weather-recipes", {
        baseURL: "http://localhost:3000",
        params: { lat: location.lat, lon: location.lon, number: 10 },
      });
      setWeatherData(data);
      const arr: Recipe[] = (data.recipes || []).map((r: any) => ({
        ...r,
        ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
      }));
      setRecipes(shuffle(arr).slice(0, 6));
      setStep("weather");
    } catch (e: any) {
      setError(e.response?.data?.error || "Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelection = async (mood: string) => {
    if (!location) return setError("Location missing");
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/weather-recipes", {
        baseURL: "http://localhost:3000",
        params: {
          lat: location.lat,
          lon: location.lon,
          category: mood,
          number: 10,
        },
      });
      const arr: Recipe[] = (data.recipes || []).map((r: any) => ({
        ...r,
        ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
      }));
      setRecipes(shuffle(arr).slice(0, 6));
      setStep("mood");
    } catch (e: any) {
      setError(e.response?.data?.error || "Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const uniqueIngredients = Array.from(
    new Set(
      recipes.flatMap((r) =>
        r.ingredients.map((ing: Ingredient) => ing.name.toLowerCase())
      )
    )
  ).sort();

  const filteredRecipes = recipes
    .map((r) => {
      const missing = r.ingredients
        .filter((ing) => !selectedIngredients.includes(ing.name.toLowerCase()))
        .map((ing) => ing.name);
      return { ...r, missingIngredients: missing };
    })
    .sort((a, b) => a.missingIngredients.length - b.missingIngredients.length);

  const resetAll = () => {
    setStep("greeting");
    setWeatherData(null);
    setRecipes([]);
    setSelectedRecipe(null); // clear details selection
    setSelectedMood("");
    setSelectedIngredients([]);
  };

  return {
    weatherData,
    recipes,
    loading,
    error,
    step,
    selectedMood,
    selectedIngredients,
    uniqueIngredients,
    filteredRecipes,
    showIngredientFilter,
    setShowIngredientFilter,
    fetchWeatherRecipes,
    handleMoodSelection,
    setSelectedMood,
    setSelectedIngredients,
    setStep,
    resetAll,

    // **NEW** expose these two
    selectedRecipe,
    setSelectedRecipe,
  };
}
