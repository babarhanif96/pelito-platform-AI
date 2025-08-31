const express = require("express")
const router = express.Router();
const ratingController = require("../controller/ratingController");
const { protect } = require("../middleware/authMiddleware");

// Product Routes
router.post('/',protect,ratingController.addRating);
router.get('/get-all-product/:user_id',protect,ratingController.getAllRatingByUserId);
router.get('/:id',protect,ratingController.getRatingById);
router.put('/:id',protect,ratingController.updateRating);
router.delete('/:id',protect,ratingController.deleteRating);
router.get('/rating-by-productId/:product_id',protect,ratingController.getAllRatingByProductId);
router.get('/rating-by-serviceId/:service_id',protect,ratingController.getAllRatingByServiceId);

module.exports = router