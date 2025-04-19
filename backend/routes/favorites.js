const express = require("express");
const router = express.Router();
const {
  addFavoriteRecipe,
  getFavorites,
  removeFavorite,
} = require("../controllers/favoritesController");
const { authenticate } = require("../middleware/authMiddleware"); // Ensure this path is correct

router.use(authenticate); // This applies the middleware to all favorites routes

router.post("/", addFavoriteRecipe);
router.get("/", getFavorites);
router.delete("/:favoriteId", removeFavorite);

module.exports = router;
