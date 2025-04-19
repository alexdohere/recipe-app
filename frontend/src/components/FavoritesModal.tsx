import React from "react";
import { Recipe } from "../types";

interface Props {
  show: boolean;
  favorites: Recipe[];
  onClose(): void;
  onSelect(recipe: Recipe): void;
}

export default function FavoritesModal({
  show,
  favorites,
  onClose,
  onSelect,
}: Props) {
  if (!show) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h3>Your Favorites</h3>
        {favorites.length === 0 ? (
          <p>No favorites found.</p>
        ) : (
          <ul className="favorites-list">
            {favorites.map((fav) => (
              <li
                key={fav.id}
                style={{ cursor: "pointer" }}
                onClick={() => onSelect(fav)}
              >
                <strong>{fav.title}</strong>
                <br />
                <img
                  src={fav.image}
                  alt={fav.title}
                  style={{ width: "150px" }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
