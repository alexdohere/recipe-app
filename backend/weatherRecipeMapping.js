// backend/weatherRecipeMapping.js
const axios = require("axios");

/**
 * Map current weather to a high‑level recipe category.
 */
const getWeatherBasedRecipeCategory = (weatherCondition, temperature) => {
  let category = "comfort food";

  if (temperature < 10) {
    // Cold
    if (weatherCondition === "rain" || weatherCondition === "drizzle") {
      category = "soup";
    } else if (weatherCondition === "snow") {
      category = "warm drinks";
    } else {
      category = "casserole";
    }
  } else if (temperature > 25) {
    // Hot
    category = "salad";
  } else {
    // Moderate
    if (weatherCondition === "rain" || weatherCondition === "drizzle") {
      category = "stew";
    } else if (weatherCondition === "clear") {
      category = "grilled meals";
    } else {
      category = "pasta";
    }
  }

  return category;
};

/**
 * Given a category string, returns up to 6 recipes,
 * topping up with truly random recipes if necessary.
 */
const getRecipesByCategory = async (category) => {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    throw { status: 500, message: "Missing SPOONACULAR_API_KEY in .env" };
  }
  const NUM_RECIPES = 6;

  // If user wants random recipes, use the dedicated endpoint
  if (
    category.toLowerCase() === "random" ||
    category.toLowerCase() === "surprise me"
  ) {
    const randomResp = await axios.get(
      `https://api.spoonacular.com/recipes/random`,
      { params: { number: NUM_RECIPES, apiKey } }
    );
    return randomResp.data.recipes.map((r) => ({
      id: r.id,
      title: r.title,
      image: r.image,
      instructions: r.instructions || "No instructions available",
      ingredients: r.extendedIngredients || [],
    }));
  }

  // Category → one of several search presets
  const categoryMapping = {
    pasta: [
      { query: "pasta", cuisine: "Italian", type: "main course" },
      { query: "spaghetti", cuisine: "Italian", type: "main course" },
      { query: "fettuccine alfredo", cuisine: "Italian", type: "main course" },
    ],
    soup: [
      { query: "chicken soup", type: "main course" },
      { query: "tomato soup", type: "main course" },
      { query: "vegetable soup", type: "main course" },
    ],
    stew: [
      { query: "beef stew", type: "main course" },
      { query: "chicken stew", type: "main course" },
      { query: "vegetable stew", type: "main course" },
    ],
    salad: [
      { query: "Caesar salad", type: "side dish" },
      { query: "green salad", type: "side dish" },
      { query: "fruit salad", type: "side dish" },
    ],
    "comfort food": [
      { query: "mac and cheese", type: "main course" },
      { query: "pot roast", type: "main course" },
      { query: "chicken pot pie", type: "main course" },
      { query: "shepherd's pie", type: "main course" },
      { query: "meatloaf", type: "main course" },
    ],
    "warm drinks": [
      { query: "hot chocolate", type: "drink" },
      { query: "chai latte", type: "drink" },
      { query: "mulled cider", type: "drink" },
    ],
    casserole: [
      { query: "chicken casserole", type: "main course" },
      { query: "tuna casserole", type: "main course" },
      { query: "vegetable casserole", type: "main course" },
    ],
    "grilled meals": [
      { query: "grilled chicken", type: "main course" },
      { query: "grilled steak", type: "main course" },
      { query: "grilled salmon", type: "main course" },
    ],
    curry: [
      { query: "chicken curry", cuisine: "Indian", type: "main course" },
      { query: "vegetable curry", cuisine: "Indian", type: "main course" },
      { query: "beef curry", cuisine: "Indian", type: "main course" },
    ],
  };

  // Pick one of the presets at random (or default to a bare text search)
  const presets = categoryMapping[category] || [{ query: category }];
  const mapping = Array.isArray(presets)
    ? presets[Math.floor(Math.random() * presets.length)]
    : presets;

  try {
    // 1) Do a normal search
    const totalResp = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch`,
      {
        params: {
          ...mapping,
          number: NUM_RECIPES,
          offset: 0,
          apiKey,
        },
      }
    );
    const found = totalResp.data.results || [];

    // 2) If we got fewer than needed, top up with truly random recipes
    let combined = [...found];
    if (combined.length < NUM_RECIPES) {
      const toFetch = NUM_RECIPES - combined.length;
      const randomResp = await axios.get(
        `https://api.spoonacular.com/recipes/random`,
        { params: { number: toFetch, apiKey } }
      );
      combined = combined.concat(randomResp.data.recipes);
    }

    // 3) Fetch full details for each
    const detailed = await Promise.all(
      combined.map(async (r) => {
        // If it already came from the random endpoint it has full details
        if (r.instructions !== undefined && r.extendedIngredients) {
          return {
            id: r.id,
            title: r.title,
            image: r.image,
            instructions: r.instructions,
            ingredients: r.extendedIngredients,
          };
        }
        // Otherwise fetch details
        const info = await axios.get(
          `https://api.spoonacular.com/recipes/${r.id}/information`,
          { params: { apiKey } }
        );
        return {
          id: info.data.id,
          title: info.data.title,
          image: info.data.image,
          instructions: info.data.instructions || "No instructions available",
          ingredients: info.data.extendedIngredients || [],
        };
      })
    );

    return detailed.slice(0, NUM_RECIPES);
  } catch (err) {
    if (err.response?.status === 402) {
      throw {
        status: 402,
        message: "API limit exceeded. Please try again later.",
      };
    }
    console.error("Error fetching recipes:", err.message);
    throw {
      status: 500,
      message: "Error fetching recipes. Please try again later.",
    };
  }
};

module.exports = { getWeatherBasedRecipeCategory, getRecipesByCategory };
