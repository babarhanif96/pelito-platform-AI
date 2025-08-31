const express = require("express")
const router = express.Router();
const professionalWorkingController = require("../controller/professionalWorkingController");
const { protect } = require("../middleware/authMiddleware");

// professionalWorking Routes
router.post('/',protect,professionalWorkingController.addProfessionalWorkingHours);
router.get('/get-working-hours/:user_id',professionalWorkingController.getAllProfessionalWorkingHoursByUserId);
router.get('/:id',protect,professionalWorkingController.getProfessionalWorkingHoursById);
router.put('/set-on-off',professionalWorkingController.setOnOff);
router.put('/set-on-off-working-hours',professionalWorkingController.setOnOffWorkingHours);
router.put('/:id',protect,professionalWorkingController.updateProfessionalWorkingHours);
router.delete('/:id',protect,professionalWorkingController.deleteProfessionalWorkingHours);


module.exports = router