const { db } = require("../config/db");

const addFavorite = async (userId, recipe) => {
  // Storing recipe data as JSON in the recipe_data column
  return db("favorites")
    .insert({
      user_id: userId,
      recipe_id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      instructions: recipe.instructions,
      recipe_data: JSON.stringify(recipe),
    })
    .returning("*");
};

const getFavoritesByUser = async (userId) => {
  return db("favorites").where({ user_id: userId });
};

const deleteFavorite = async (favoriteId, userId) => {
  return db("favorites").where({ id: favoriteId, user_id: userId }).del();
};

module.exports = {
  addFavorite,
  getFavoritesByUser,
  deleteFavorite,
};
