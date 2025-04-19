import React from "react";

interface Props {
  show: boolean;
  uniqueIngredients: string[];
  selectedIngredients: string[];
  onToggle(): void;
  onChange(ingredient: string, checked: boolean): void;
}

export default function IngredientFilter({
  show,
  uniqueIngredients,
  selectedIngredients,
  onToggle,
  onChange,
}: Props) {
  if (!show) return null;
  return (
    <section className="ingredient-filter">
      <h2>Filter by Ingredients</h2>
      <div className="ingredients-list">
        {uniqueIngredients.map((ing) => (
          <label key={ing} className="ingredient-item">
            <input
              type="checkbox"
              checked={selectedIngredients.includes(ing)}
              onChange={(e) => onChange(ing, e.target.checked)}
            />
            {ing}
          </label>
        ))}
      </div>
    </section>
  );
}
