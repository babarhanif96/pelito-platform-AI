const express = require("express")
const router = express.Router();
const slotController = require('../controller/slotController');
const { protect } = require("../middleware/authMiddleware");

router.post('/add-slot',protect,slotController.addSlot);
router.get('/get-slot/:id',protect,slotController.getSlotById);
router.get('/get-slot-by-memberid/:member_id',protect,slotController.getSlotByMemberId);
router.put('/update-slot/:id',protect,slotController.updateSlot);
router.delete('/delete-slot/:id',protect,slotController.deleteSlot);
router.get('/get-slot-for-customer/:slot_date/:member_id',slotController.getSlotBySlotDate);

// Break Time

router.post('/break-time',protect,slotController.addBreakTime);
router.get('/get-all-break-time-by-user/:user_id',protect,slotController.getBreakTimeByUserId);
router.get('/get-all-break-time-by-slot/:slot_id',protect,slotController.getBreakTimeBySlotId);
router.put('/break-time/:id',protect,slotController.updateBreakTime);
router.delete('/break-time/:id',protect,slotController.deleteBreakTime);
router.get('/get-break-time-by-member/:member_id',protect,slotController.getBreakTimeByMemberId);

// Member shift
router.get('/shift-for-member/:member_id',protect,slotController.getShiftDayByMemberId);
router.put('/shift-for-member',protect,slotController.updateShiftTime);

router.get('/check-slot-exist/:member_id',slotController.checkSlotExistOrNot);

module.exports = router