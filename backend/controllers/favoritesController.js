const {
  addFavorite,
  getFavoritesByUser,
  deleteFavorite,
} = require("../models/Favorite");

const addFavoriteRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipe = req.body.recipe;
    const favorite = await addFavorite(userId, recipe);
    res.json(favorite[0]);
  } catch (err) {
    console.error("Add favorite error:", err); // This will log the full error
    res
      .status(500)
      .json({ error: "Error adding favorite", details: err.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await getFavoritesByUser(userId);
    res.json(favorites);
  } catch (err) {
    console.error("Get favorites error:", err);
    res.status(500).json({ error: "Error retrieving favorites" });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { favoriteId } = req.params;
    await deleteFavorite(favoriteId, userId);
    res.json({ message: "Favorite deleted" });
  } catch (err) {
    console.error("Delete favorite error:", err);
    res.status(500).json({ error: "Error deleting favorite" });
  }
};

module.exports = { addFavoriteRecipe, getFavorites, removeFavorite };
