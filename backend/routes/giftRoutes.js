const express = require("express")
const router = express.Router();
const giftCardController = require("../controller/giftCardController");
const { protect } = require("../middleware/authMiddleware");

// Category Routes
router.post('/create', protect, giftCardController.createCard);

router.get('/cards', protect, giftCardController.getAllGiftCardsForUser);

router.get('/verify', giftCardController.verifyCode);

module.exports = router