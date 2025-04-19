export interface WeatherData {
  temperature: number;
  condition: string;
  category: string;
  suggestedIngredient: string;
  city: string;
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  instructions: string;
  ingredients: Ingredient[];
  missingIngredients: string[];
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export type Mood =
  | "Comforting & Warm"
  | "Light & Fresh"
  | "Quick & Easy"
  | "Something Exotic"
  | "Surprise Me";
