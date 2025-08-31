const express = require("express")
const router = express.Router();
const userController = require('../controller/userController');
const passport = require("passport");
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const { payment } = require("../controller/paymentController");



router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/offline-signup', userController.offlineSignup);

router.get('/me', protect, userController.getLoggedInUserDetails);
router.put('/update-profile/:user_id', protect, userController.updateProfile);
router.get('/profile/:user_id', protect, userController.getProfile);
router.post('/verify-otp-email', userController.verifyOTP);
router.put('/reset-password/:user_id', protect, userController.resetPassword);
router.put('/forgot-password', userController.forgotPassword);
router.put('/verify-otp-forgot', userController.verifyOTPForForgot);

// Social Login
// router.get('/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   function(req, res) {
//     // Successful authentication, redirect or handle as needed
//     res.status(201).json({ data : req.user});          
//   });
router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
	"/google/callback",
	passport.authenticate("google", {
		session: true,
		successRedirect: "https://staging.pelito.net",
		failureRedirect: "",
	}),
);
router.get("/login/success", userController.successfullGoogleLogin)

// User Interest
router.post('/add-interest', userController.addInterest);
router.put('/skip-interest/:user_id', userController.skipInterest);

// Get All professional user
router.get('/salon-list', userController.getAllSalon);
router.get('/get-all-professional-images/:user_id', protect, userController.getAllProfessionalWorkImages);
router.put('/sort-image/:user_id', protect, userController.sortImage);
router.post('/professional-images', protect, userController.addProfessionalWorkImages);
router.delete('/professional-images/:id', protect, userController.deleteProfessionalWorkImages);
router.put('/professional-images', protect, userController.updatePriorityInProfessionalWorkImages);
router.put('/professional/stripe-payments', protect, userController.stripePaymentEnable);

router.get('/get-salon-details/:profile_name', userController.getSalonDetailsByUserId);

router.put('/update-primary-salon/:user_id', protect, userController.updatePrimarySalon);

router.put('/send-crypto', protect, userController.sendCrypto);

router.route('/payment').post(payment)

router.get('/logout', userController.logoutUser);

router.delete('/del', protect, userController.delAccount);

router.put('/off-days', protect, userController.offDays);

router.put('/claim-airdrop', protect, userController.claimAirdrop);

router.post('/subscribe-email', userController.addSubscribeEmail);
router.post('/inquiry-email', userController.addInquiryEmail);
router.get('/boarding-link/:user_id', userController.generateBoardingLink);
router.get('/professional-user', userController.getAllProfessonalUser);

// invite 
router.post('/invite', userController.addInviteAndSendMail);
router.get('/get-all-invites/:user_id', userController.getInvite);


router.get('/admin/users', authorizeRole('admin') , userController.allUsers);
router.put('/admin/suspend/:userId', authorizeRole('admin') , userController.accSuspension);
router.put('/admin/delAcc/:userId', authorizeRole('admin') , userController.adminDelAccount);
router.get('/admin/tx', authorizeRole('admin') , userController.allTx);
router.get('/admin/activty', authorizeRole('admin') , userController.userActivity);
router.get('/admin/user/detail', authorizeRole('admin') , userController.adminUserDeatil);


module.exports = router