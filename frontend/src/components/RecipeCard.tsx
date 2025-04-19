import React from "react";
import { Recipe } from "../types";

interface Props {
  recipe: Recipe;
  onSelect(): void;
}

export default function RecipeCard({ recipe, onSelect }: Props) {
  return (
    <div
      className="recipeCard"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "320px", // total card height
        boxSizing: "border-box",
        padding: "0.75rem",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: "1.3rem",
          lineHeight: "1.2",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          minHeight: "2.4em", // exactly 2 lines
        }}
      >
        {recipe.title}
      </h3>

      {/* This div will grow to fill all space between title and button */}
      <div style={{ flex: 1, overflow: "hidden", margin: "0.5rem 0" }}>
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipeImage"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <button
        className="button secondary"
        onClick={onSelect}
        style={{
          alignSelf: "center",
        }}
      >
        View Details
      </button>
    </div>
  );
}
