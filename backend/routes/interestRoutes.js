const express = require("express")
const router = express.Router();
const interestController = require("../controller/interestController");
const { protect } = require("../middleware/authMiddleware");

// Category Routes
router.post('/category',protect,interestController.addCategory);
router.get('/category',interestController.getAllCategory);
router.get('/category/:id',interestController.getCategoryById);
router.put('/category/:id',protect,interestController.updateCategory);
router.delete('/category/:id',protect,interestController.deleteCategory);

// SUb category ROutes
router.post('/sub-category',protect,interestController.addSubCategory);
router.get('/sub-category/:id',interestController.getSubCategoryById);
router.get('/sub-category-by-category/:category_id',interestController.getSubCategoryByCategoryId);
router.put('/sub-category/:id',protect,interestController.updateSubCategory);
router.delete('/sub-category/:id',protect,interestController.deleteSubCategory);
router.get('/get-all-sub-category',interestController.getAllSubCategory);


module.exports = router