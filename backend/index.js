const express = require("express");
const path = require("path");
const getWeather = require("./routes/weather");
const recipesRouter = require("./routes/recipes"); // Existing recipes router
const authRouter = require("./routes/auth"); // New authentication routes
const favoritesRouter = require("./routes/favorites"); // New favorites routes
require("dotenv").config();
const cors = require("cors");
const {
  getWeatherBasedRecipeCategory,
  getRecipesByCategory,
} = require("./weatherRecipeMapping");

const app = express();

app.use(express.json());
app.use(cors());

// Temporary in-memory storage for pantry (replace with a database later)
let userPantry = [];

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Weather Mood Food App!");
});

// Weather route
app.get("/weather", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude parameters are required" });
  }

  try {
    const weatherData = await getWeather(lat, lon);
    if (!weatherData) {
      return res.status(500).json({ error: "Unable to fetch weather data" });
    }

    const { main, weather, name } = weatherData; // Add 'name' for city name
    const temperature = main.temp;
    const condition = weather[0].main.toLowerCase();
    const category = getWeatherBasedRecipeCategory(condition, temperature);

    res.json({ temperature, condition, category, city: name });
  } catch (error) {
    console.error("Error fetching weather:", error.message);
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

// Weather-based recipes route
app.get("/weather-recipes", async (req, res) => {
  const { lat, lon, category: userCategory } = req.query; // Also extract user-provided category
  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude parameters are required" });
  }

  try {
    const weatherData = await getWeather(lat, lon);
    if (!weatherData) {
      return res.status(500).json({ error: "Unable to fetch weather data" });
    }

    const { main, weather, name } = weatherData;
    const temperature = main.temp;
    const condition = weather[0].main.toLowerCase();

    // Use user-provided category if available, otherwise compute from weather
    const category = userCategory
      ? userCategory.toString()
      : getWeatherBasedRecipeCategory(condition, temperature);

    const recipes = await getRecipesByCategory(category);

    const recipesWithAvailability = recipes.map((recipe) => {
      const missingIngredients = recipe.ingredients.filter(
        (ingredient) => !userPantry.includes(ingredient.name.toLowerCase())
      );
      return {
        ...recipe,
        missingIngredients,
      };
    });

    res.json({
      temperature,
      condition,
      category,
      city: name,
      recipes: recipesWithAvailability,
    });
  } catch (error) {
    console.error("Error fetching weather-based recipes:", error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Save pantry ingredients
app.post("/pantry", (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: "Ingredients array is required" });
  }
  userPantry = ingredients.map((ingredient) => ingredient.toLowerCase());
  res.json({ message: "Pantry updated successfully", pantry: userPantry });
});

// Retrieve pantry ingredients
app.get("/pantry", (req, res) => {
  res.json({ pantry: userPantry });
});

// Use the recipes router
app.use("/recipes", recipesRouter);

// Authentication routes
app.use("/auth", authRouter);

// Favorites routes (protected by auth middleware)
app.use("/favorites", favoritesRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
