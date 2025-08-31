const express = require("express")
const router = express.Router();
const serviceController = require('../controller/serviceController');
const passport = require("passport");
const { protect } = require("../middleware/authMiddleware");


router.post('/professional-service',protect,serviceController.addService);
router.get('/get-all-professional-service/:user_id',protect,serviceController.getServiceByUserId);
router.get('/professional-service/:id',protect,serviceController.getServiceById);
router.put('/professional-service/:id',protect,serviceController.updateService);
router.delete('/professional-service/:id',protect,serviceController.deleteService);

router.post('/add-service-booking',protect,serviceController.addBooking);
router.put('/update-service-booking',protect,serviceController.updateBooking);
router.get('/get-booking-service/:user_id',serviceController.getBookingServices);
// router.get('/get-booked-booking-service/:user_id',serviceController.getBookedBookingServices);
router.get('/get-my-salons/:user_id',protect,serviceController.getMySalons);
router.delete('/booking-service/:id/:slot_id',protect,serviceController.deleteBookingService);
router.post('/add-payment',serviceController.addPayment);
router.post('/send-tip',serviceController.sendTip);
router.post('/add-payment/crypto',serviceController.addPaymentCrypto);
router.get('/get-member-booking-service/:member_id',protect,serviceController.getBookedBookingServicesByMemberId);
router.get('/get-booked-booking-service/:user_id',protect,serviceController.getBookedServicesByCustomer);
router.get('/get-completed-booking-service/:user_id',protect,serviceController.getCompletedBookingServicesByCustomer);
router.get('/get-cancel-booking-service/:user_id',protect,serviceController.getCancelBookingServicesByCustomer);
router.put('/cancel-booking/:booking_id',serviceController.cnaceledTheBooking);
router.put('/cancel-booking-by-salon/:booking_id',serviceController.cnaceledTheBookingBySalon);
router.put('/update-recurring-status/:booking_id',serviceController.updateRecurringStatus);
router.put('/update',serviceController.updateBookingStatus);

//  report for salon & admin
router.get('/get-report-salon/:salon_id',serviceController.getReportForSalon);
router.put('/booking-status-for-offline',serviceController.updateBookingStatusForOffline);
router.get('/seller-report/:user_id',serviceController.getBookedServicesBySeller);

module.exports = router