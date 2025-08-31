const express = require("express")
const router = express.Router();
const memberController = require("../controller/memberController");
const { protect } = require("../middleware/authMiddleware");

// Member Routes
router.post('/',protect,memberController.addMember);
router.get('/get-all-member/:user_id',memberController.getAllMemberByUserId);
router.get('/:id',protect,memberController.getMemberById);
router.put('/:id',protect,memberController.updateMember);
router.delete('/:id',protect,memberController.deleteMember);

module.exports = router