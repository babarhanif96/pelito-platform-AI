const express = require("express")
const router = express.Router();
const wishlistController = require("../controller/wishlistController");
const { protect } = require("../middleware/authMiddleware");

// Wishlist Routes
router.post('/',protect,wishlistController.addWishlist);
router.get('/by-userid/:user_id',protect,wishlistController.getAllWishlistByUserId);
router.get('/:id',protect,wishlistController.getWishlistById);
router.put('/:id',protect,wishlistController.updateWishlist);
router.delete('/:id',protect,wishlistController.deleteWishlist);


module.exports = router