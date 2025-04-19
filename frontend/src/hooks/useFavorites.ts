// src/hooks/useFavorites.ts
import { useState } from "react";
import axios from "axios";
import { Recipe } from "../types";

export default function useFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");
    const { data } = await axios.get("/favorites", {
      baseURL: "http://localhost:3000",
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavorites(data);
    setShowFavorites(true);
  };

  const addFavorite = async (r: Recipe) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");
    await axios.post(
      "/favorites",
      { recipe: r },
      {
        baseURL: "http://localhost:3000",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Added!");
  };

  const deleteFavorite = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");
    await axios.delete(`/favorites/${id}`, {
      baseURL: "http://localhost:3000",
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavorites((f) => f.filter((x) => x.id !== id));
  };

  return {
    favorites,
    showFavorites,
    fetchFavorites,
    addFavorite,
    deleteFavorite,
    setShowFavorites,
  };
}
