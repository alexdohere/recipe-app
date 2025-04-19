import React from "react";
import { Recipe } from "../types";
import { stripHtmlTags } from "../utils"; // we’ll create stripHtmlTags in utils.ts

interface Props {
  recipe: Recipe | null;
  onClose(): void;
  onAddFavorite(recipe: Recipe): void;
  onDeleteFavorite(recipeId: number): void;
  isFavorite: boolean;
  isLoggedIn: boolean;
}

export default function RecipeDetailsModal({
  recipe,
  onClose,
  onAddFavorite,
  onDeleteFavorite,
  isFavorite,
  isLoggedIn,
}: Props) {
  if (!recipe) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h3>{recipe.title}</h3>
        <img src={recipe.image} alt={recipe.title} className="modal-image" />
        <p>{stripHtmlTags(recipe.instructions)}</p>
        <ul className="ingredientsList">
          {(recipe.ingredients || []).map((ing, i) => (
            <li key={i}>{ing.name}</li>
          ))}
        </ul>
        {isLoggedIn && (
          <button
            className="button secondary"
            onClick={() =>
              isFavorite ? onDeleteFavorite(recipe.id) : onAddFavorite(recipe)
            }
            style={{ display: "block", margin: "1rem auto" }}
          >
            {isFavorite ? "Delete from Favorites" : "Add to Favorites"}
          </button>
        )}
      </div>
    </div>
  );
}
