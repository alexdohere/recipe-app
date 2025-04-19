const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/search-by-ingredients", async (req, res) => {
  const ingredients = req.query.ingredients;
  if (!ingredients) {
    return res.status(400).json({ error: "Please provide ingredients." });
  }

  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Missing SPOONACULAR_API_KEY in .env" });
  }

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients`,
      {
        params: { ingredients, number: 5, apiKey },
      }
    );

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: "No recipes found" });
    }

    const detailedRecipes = await Promise.all(
      response.data.map(async (recipe) => {
        try {
          const recipeDetails = await axios.get(
            `https://api.spoonacular.com/recipes/${recipe.id}/information`,
            { params: { apiKey } }
          );

          return {
            title: recipe.title,
            image: recipe.image,
            instructions:
              recipeDetails.data.instructions || "No instructions available",
            ingredients: recipeDetails.data.extendedIngredients || [],
          };
        } catch (innerError) {
          console.error("Error fetching recipe details:", innerError.message);
          return null;
        }
      })
    );

    res.json(detailedRecipes.filter((recipe) => recipe !== null));
  } catch (error) {
    console.error("Error retrieving recipes:", error.message);
    res.status(500).json({ error: "Error fetching recipes." });
  }
});

module.exports = router;
