// src/utils/index.ts
import { WeatherData } from "../types";

/** Strip HTML tags from a string */
export const stripHtmlTags = (html: string): string =>
  html.replace(/<[^>]*>?/gm, "");

/** Shuffle an array in-place (Fisher–Yates) */
export const shuffle = <T>(arr: T[]): T[] => {
  const a = arr.slice();
  let i = a.length;
  while (i > 1) {
    const j = Math.floor(Math.random() * i--);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Map weather condition to a CSS class */
export const getBackgroundClass = (cond: string): string => {
  const c = cond.toLowerCase();
  if (c === "clear") return "clear";
  if (c === "clouds") return "cloudy";
  if (c === "rain" || c === "drizzle") return "rainy";
  if (c === "snow") return "snowy";
  return "";
};

/** Build a human‐friendly weather description */
export const getWeatherDescription = (wd: WeatherData): string => {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const tempDesc =
    wd.temperature < 10 ? "chilly" : wd.temperature > 25 ? "warm" : "pleasant";
  const condDesc =
    wd.condition === "clear"
      ? "clear skies"
      : wd.condition === "clouds"
      ? "cloudy"
      : wd.condition;
  return `It's a ${tempDesc} ${timeOfDay} with ${condDesc} in ${wd.city}.`;
};

/** Random mood messages */
const _moods = [
  "Maybe you'll see some suggestions that raise your appetite!",
  "How about a mood boost with these meal ideas?",
  "Your taste, your mood—here come some tasty options!",
  "Don't worry, these suggestions might just hit the spot!",
];
export const getRandomMoodMessage = (): string =>
  _moods[Math.floor(Math.random() * _moods.length)];
