const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const passport = require("passport");
const UserInterest = require("../models/userInterestModel");
const ProfessionalWorkImages = require("../models/professionalWorkImagesModel");
const ProfessionalService = require("../models/professionalServiceModel");
const Posts = require("../models/postModel");
const Comments = require("../models/commentsModel");
const Likes = require("../models/likesModel");
const Products = require("../models/productModel");
const ProfessionalWorkingHours = require("../models/professionalWorkingHoursModel");
const Rating = require("../models/ratingModel");
const Subscribe = require("../models/subscribeModel");
const { verifyMail, subscriberMail, forgotMail, inquiryrMail, sendInviteMail } = require("../utils/email");
const Inquiry = require("../models/inquiryModel");
const { generateAccountIdForSeller, generateAccountlink, checkUserOnboardingOrNot } = require("../utils/stripe");
const StripeSellerAccount = require("../models/stripeSellerAccountModel");
const Invite = require("../models/inviteModel");
const ethers = require('ethers');
const crypto = require('crypto-js');
const { RPC_URL, TOKEN_ADDRESS, TOKEN_ABI } = require("../constant");
const Slot = require('../models/slotModel');
const SavedPosts = require('../models/savedPostsModel');
const Reactions = require('../models/reactionsModel');
const BookingService = require('../models/bookingServiceModel');
const PaymentModel = require('../models/paymentModel');
const ActivityModel = require('../models/ActivityModel');
const Web3 = require('web3');



var userController = {};

userController.delAccount = async function (req, res) {
  try {
    const { user_id } = req.body;

    // Find the user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Check if the user has any active bookings (status: "booked" or "paid")
    const activeBookings = await BookingService.findOne({
      $or: [
        { seller_user_id: user_id, status: { $in: ["booked", "paid"] } }
      ]
    });

    if (activeBookings) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete account with upcoming bookings",
      });
    }

    // Delete related records
    await Slot.deleteMany({ salon_id: user_id });
    await Rating.deleteMany({ $or: [{ user_id }, { salon_id: user_id }] });
    await Products.deleteMany({ user_id });
    await Posts.deleteMany({ user_id });
    await Likes.deleteMany({ user_id });
    await Comments.deleteMany({ user_id });
    await BookingService.deleteMany({
      $or: [
        { customer_user_id: user_id },
        { appointment_ref: user_id },
        { seller_user_id: user_id }
      ]
    });

    // Delete the user
    await User.findByIdAndDelete(user_id);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

userController.stripePaymentEnable = async function (req, res) {
  try {
    const { user_id } = req.body;

    // Find the user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.IsStripeEnabled = !user.IsStripeEnabled
    await user.save()

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


userController.offDays = async function (req, res) {
  try {
    const { name, user_id } = req.body;

    // Find the user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Check if the day already exists in offDays
    const index = user.offDays.indexOf(name);
    if (index !== -1) {
      // If exists, remove it
      user.offDays.splice(index, 1);
    } else {
      // If not exists, add it
      user.offDays.push(name);
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};



userController.signup = async function (req, res) {
  try {
    const {
      firstName: first_name,
      lastName: last_name,
      phoneNumber: phone_number,
      email,
      password,
      user_type,
    } = req.body;

    // Validate user input
    if (!first_name || !last_name || !phone_number || !email || !password || !user_type) {
      return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    const lowerCaseEmail = email.toLowerCase();

    // Check if the email is already registered (no user_type check)
    const existingEmail = await User.findOne({ email: lowerCaseEmail });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered. Please use a different email.",
      });
    }

    // Check if the phone number is already registered
    const existingPhone = await User.findOne({ phone_number });
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number is already registered. Please use a different phone number.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generates a 6-digit OTP

    let wallet, encryptedPrivateKey;
    if (user_type === 'professional') {
      wallet = ethers.Wallet.createRandom();
      encryptedPrivateKey = crypto.AES.encrypt(wallet.privateKey, process.env.JWT_SECRET_KEY).toString();
    }

    // Create a new user instance
    let newUser = await User.create({
      first_name,
      last_name,
      phone_number,
      email: lowerCaseEmail,
      user_type,
      password: hashedPassword,
      profile_name: '',
      otp,
      address: wallet ? wallet.address : '',
      privateKey: encryptedPrivateKey || '',
      email_verify: false,
      loggedAt: new Date(),
      profile_picture: 'https://res.cloudinary.com/doytf8ce3/image/upload/v1693086923/dummy_fxiudh.jpg',
      cover_pic: 'https://res.cloudinary.com/doytf8ce3/image/upload/v1738499990/img8_qw57l8.png'
    });

    // If the user is a professional, generate a Stripe account
    if (user_type === 'professional') {
      const { account_id, accountLink } = await generateAccountIdForSeller();
      await StripeSellerAccount.create({
        user_id: newUser._id,
        account_id
      });
      boarding_url = accountLink;
    }

    // Send verification email
    await verifyMail(newUser, otp);

    res.json({
      status: 'Pending',
      message: 'Verification OTP email sent',
      data: {
        userId: newUser._id,
        email: newUser.email
      },
      success: true
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};




userController.login = async function (req, res) {
  try {
    // Extract user input from the request body
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password." });
    }

    const lowerCaseEmail = email.toLowerCase();

    // Find user by email (without checking user_type)
    let user = await User.findOne({ email: lowerCaseEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password." });
    }

    if (user.isSuspended) {
      return res.status(401).json({ success: false, message: "Your account has been suspended." });
    }

    // Check if email is verified
    if (!user.email_verify) {
      const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generates a 6-digit OTP

      user.otp = otp;
      await user.save();

      // Send verification email
      await verifyMail(user, otp);

      return res.json({
        status: 'Pending',
        message: 'Verification OTP email sent',
        data: {
          userId: user._id,
          email: user.email
        },
        success: true
      });
    }

    user.loggedAt = new Date();
    await user.save();

    await ActivityModel.create({
      action: 'User Logged In',
      user: user._id
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY);

    // Send the response
    res.status(200).json({
      success: true,
      token,
      user: {
        ...user._doc,
        user_id: user._id,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};




userController.offlineSignup = async function (req, res) {
  try {
    // Extract user input from the request body
    const { first_name, phone_number, email } =
      req.body;

    // Validate user input (add more validation if needed)
    if (!first_name || !phone_number) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    // Check if the email & phone is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.phone_number === phone_number) {
      return res.status(409).json({
        existingUser,
        message:
          "Phone no is already registered. Please use a different phone no.",
      });
    }

    if (existingUser) {
      return res.status(409).json({
        existingUser,
        message: "Email is already registered. Please use a different email.",
      });
    }


    // Create a new user instance
    let newUser = await User.create({
      first_name,
      phone_number,
      booking_user_type: 'offline',
      email
    });

    // stripe account details 


    let response = {
      user_id: newUser._id,
      first_Name: newUser.first_name,
      phone_Number: newUser.phone_number,
      booking_user_type: newUser.booking_user_type,
      email
    };

    // Save the user to the database
    res
      .status(201)
      .json({ message: "User registered successfully.", user: response });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

userController.verifyOTP = async function (req, res) {
  try {
    const { user_id, otp } = req.body;
    const user = await User.findById({ "_id": user_id });

    if (!user) {
      return res.status(400).json({ success: false, message: 'OTP not generated for this email' });
    }


    if (Number(otp) === Number(user.otp)) {

      // Validate categories and subcategories before saving to the database
      await User.findOneAndUpdate(
        { "_id": user_id },
        { $set: { email_verify: true } },
        { new: true }
      );

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY);

      await ActivityModel.create({
        action: 'Account Registered',
        user: user._id
      });


      return res.json({
        success: true,
        message: 'OTP verification successful',
        token,
        user: {
          ...user._doc,
          user_id: user._id,
        }
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

  } catch (err) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

userController.successfullGoogleLogin = async (req, res) => {
  const sessionData = req.session.passport;

  if (sessionData && sessionData.user) {

    const user = await User.findOne({ email: sessionData.user.email.toLowerCase() })
    const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user: {
        user_id: user._id,
        first_Name: user.first_name,
        last_Name: user.last_name,
        email: user.email,
        phone_Number: user.phone_number,
        interest_status: user.interest_status,
        user_type: user.user_type,
        address_line1: user.address_line1,
        address_line2: user.address_line2,
        pincode: user.pincode,
        description: user.description,
        phone_number: user.phone_number,
        profile_picture: user.profile_picture,
        profile_name: user.profile_name,
        cover_pic: user.cover_pic,
      },
    });
  }
  else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }

};
userController.getProfile = async function (req, res) {
  try {
    // Extract user input from the request body
    const { user_id } = req.params;

    // Find the user in the database based on email or phone_number
    let user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    //check if its professional
    let userOnboardedStatus = false
    let boarding_url = ''
    if (user.user_type == 'professional') {
      const stripeAccountData = await StripeSellerAccount.findOne({ user_id: user._id })
      if (!stripeAccountData) {
        const { account_id, accountLink } = await generateAccountIdForSeller()
        let stripeDetails = await StripeSellerAccount.create({
          user_id: user._id,
          account_id
        });
        console.log("----------stripeDetails", stripeDetails)
        boarding_url = accountLink
        // userOnboardedStatus  = await checkUserOnboardingOrNot(stripeAccountData.account_id)
      } else {
        userOnboardedStatus = await checkUserOnboardingOrNot(stripeAccountData.account_id)
        if (!userOnboardedStatus) {
          const accountLink = await generateAccountlink(stripeAccountData.account_id)
          boarding_url = accountLink
        }
      }
    }
    // console.log(user)
    // user.userOnboardedStatus = userOnboardedStatus?userOnboardedStatus:''
    // user.boarding_url = boarding_url?boarding_url:''
    // console.log(user)

    // Send the token and user data in the response
    res.status(200).json({ user, userOnboardedStatus, boarding_url });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
userController.getLoggedInUserDetails = async function (req, res) {

  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  const user = await User.findById(req.user._id);

  if (user.isSuspended) {
    return res.status(401).json({ success: false, message: "Your account has been suspended." });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY);



  res.status(200).json({
    success: true,
    user,
    token
  });

};
userController.addInterest = async function (req, res) {
  try {
    const { user_id, categories } = req.body;

    // Validate categories and subcategories before saving to the database
    const userInterest = await UserInterest.findOne({ user_id: user_id });
    if (userInterest) {
      return res.status(201).json({ message: "User interest already created" });
    }
    const user = await UserInterest.create({
      user_id,
      categories,
    });
    const updatedUser = await User.findOneAndUpdate(
      { "_id": user_id },
      { $set: { interest_status: true } },
      { new: true }
    );

    res
      .status(201)
      .json({ message: "User interest created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
userController.getAllSalon = async function (req, res) {
  try {
    // Get all Professional user
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    const skip = (page - 1) * limit;

    const { search_query_1, search_query_2, type } = req.query;

    let professionalUsers = [];

    if (type == 'service' && !search_query_2) {
      const professionalServices = await ProfessionalService.find({

        service_name: { $regex: search_query_1, $options: 'i' },

      }).lean();
      const groupedServices = {};
      const serviceUserIdArray = professionalServices.map((val) => val.user_id);
      console.log(serviceUserIdArray)
      professionalUsers = await User.find({
        user_type: "professional",
        "_id": { $in: serviceUserIdArray },
      })
      console.log(professionalUsers)
      for (const services of professionalServices) {
        const userId = services.user_id;
        // If the userId is not in the groupedServices, add an empty array for that userId
        if (!groupedServices[userId]) {
          groupedServices[userId] = [];
        }
        // Push the services to the array for the corresponding userId
        groupedServices[userId].push(services);
      }
      const result = []
      professionalUsers.map((val) => {
        val.services = groupedServices[val._id] || [];
        result.push({ user: val, services: groupedServices[val._id] || [] })
        return val;
      });
      // console.log(result)
      res.json(result);

    } else {
      if (search_query_2) {
        console.log("search_query_2search_query_2search_query_2--------------------")
        professionalUsers = await User.find({
          user_type: "professional",
          ...(type && type == 'salon' && {
            first_name: { $regex: search_query_1, $options: 'i' },
          }),
          $or: [
            { country: { $regex: search_query_2.toString(), $options: 'i' } },
            { state: { $regex: search_query_2.toString(), $options: 'i' } },
            { city: { $regex: search_query_2.toString(), $options: 'i' } },
            { pincode: { $regex: search_query_2.toString(), $options: 'i' } },
          ],
        })
          .select("-password")
          .sort({ created_date: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
      } else {
        professionalUsers = await User.find({
          user_type: "professional",
          ...(type === 'salon' && {
            first_name: { $regex: search_query_1, $options: 'i' },
          }),
        })
          .select("-password")
          .sort({ created_date: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
      }

      const userIdArray = professionalUsers.map((val) => val._id);

      // Get professional users
      const professionalServices = await ProfessionalService.find({
        user_id: { $in: userIdArray },
        ...(type === 'service' &&
        {
          service_name: { $regex: search_query_1, $options: 'i' },
        }),
      }).lean();
      const groupedServices = {};

      const serviceUserIdArray = professionalServices.map((val) => val.user_id);

      for (const services of professionalServices) {
        const userId = services.user_id;
        // If the userId is not in the groupedServices, add an empty array for that userId
        if (!groupedServices[userId]) {
          groupedServices[userId] = [];
        }
        // Push the services to the array for the corresponding userId
        groupedServices[userId].push(services);
      }
      const result = []
      professionalUsers.map((val) => {
        console.log(val._id)
        result.push({ user: val, service: groupedServices[val._id] || [] })

      });

      res.json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

userController.getAllProfessonalUser = async function (req, res) {
  try {
    // Get all Professional users (no pagination)
    const professionalServices = await ProfessionalService.find().lean();

    const userIdArray = professionalServices.map((val) => val.user_id); // Get all user IDs that have services

    // Fetch all professional users who have services
    let professionalUsers = await User.find({
      user_type: "professional",
      _id: { $in: userIdArray }
    })
      .select("-password")
      .sort({ created_date: -1 })  // Optional: sorts users by creation date, change as needed
      .lean();

    const groupedServices = {};

    // Group services by userId
    for (const services of professionalServices) {
      const userId = services.user_id;
      if (!groupedServices[userId]) {
        groupedServices[userId] = [];
      }
      groupedServices[userId].push(services);
    }

    // Get ratings for each professional
    const ratingResult = await Rating.aggregate([
      {
        $match: { salon_id: { $in: userIdArray } },
      },
      {
        $group: {
          _id: '$salon_id',
          avgRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const resultMap = {};

    // Map ratings to corresponding salon_id
    for (let item of ratingResult) {
      resultMap[item._id] = item;
    }

    // Final result to send back, combining professional users, their services, and ratings
    let finalResult = [];

    professionalUsers.map((val) => {
      const rating = resultMap[val._id];
      const services = groupedServices[val._id] || [];

      // Only include professionals who have services
      if (services.length > 0) {
        finalResult.push({
          user: val,
          service: services,
          rating: rating ? rating : {}
        });
      }
    });

    // Send the final result back
    res.json(finalResult);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// userController.getAllProfessonalUser = async function (req, res) {
//   try {
//     // Get all Professional user
//     const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
//     const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

//     const skip = (page - 1) * limit;

//     // Get professional users' services first
//     const professionalServices = await ProfessionalService.find().lean();

//     const userIdArray = professionalServices.map((val) => val.user_id); // Get all user IDs that have services

//     // Fetch the professional users who have services
//     let professionalUsers = await User.find({
//       user_type: "professional",
//       _id: { $in: userIdArray }
//     })
//       .select("-password")
//       .sort({ created_date: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     const groupedServices = {};

//     for (const services of professionalServices) {
//       const userId = services.user_id;
//       // If the userId is not in the groupedServices, add an empty array for that userId
//       if (!groupedServices[userId]) {
//         groupedServices[userId] = [];
//       }
//       // Push the services to the array for the corresponding userId
//       groupedServices[userId].push(services);
//     }

//     const ratingResult = await Rating.aggregate([
//       {
//         $match: { salon_id: { $in: userIdArray } },
//       },
//       {
//         $group: {
//           _id: '$salon_id',
//           avgRating: { $avg: '$rating' },
//           totalRatings: { $sum: 1 },
//         },
//       },
//     ]);

//     const resultMap = {};

//     for (let item of ratingResult) {
//       resultMap[item._id] = item;
//     }

//     let finalResult = [];

//     professionalUsers.map((val) => {
//       const rating = resultMap[val._id];
//       const services = groupedServices[val._id] || [];

//       // Only include professionals who have services
//       if (services.length > 0) {
//         finalResult.push({
//           user: val,
//           service: services,
//           rating: rating ? rating : {}
//         });
//       }
//     });

//     res.json(finalResult);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };



userController.getSalonDetailsByUserId = async function (req, res) {
  try {
    // Extract user input from the request body
    const { profile_name:name } = req.params;

    const profile_name = name.replace(/-/g, ' ');


    // Find the user in the database with a case-insensitive search
    const user = await User.findOne({ salon_name: { $regex: new RegExp(`^${profile_name}$`, "i") } });

    if (!user) {
      return res.status(404).json({ message: "Salon not found" });
    }

    const user_id = user._id;

    const service = await ProfessionalService.find({ user_id }).sort({ created_date: -1 });

    const professionalWorkingImages = await ProfessionalWorkImages.find({ user_id }).sort({ priority: -1 });

    const product = await Products.find({ user_id });

    const professionalWorkingHours = await ProfessionalWorkingHours.find({ user_id });

    const ratingResult = await Rating.aggregate([
      {
        $match: { salon_id: user_id },
      },
      {
        $group: {
          _id: 'salon_id',
          avgRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const avgRating = ratingResult.length > 0 ? ratingResult[0].avgRating : null;
    const totalRatings = ratingResult.length > 0 ? ratingResult[0].totalRatings : 0;

    const comments = await Rating.find({ salon_id: user_id });

    const response = {
      user,
      service,
      professionalWorkingImages,
      product,
      professionalWorkingHours,
      avgRating,
      totalRatings,
      comments,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


userController.skipInterest = async function (req, res) {
  try {
    const { user_id } = req.params;

    // Validate categories and subcategories before saving to the database
    const updatedUser = await User.findOneAndUpdate(
      { "_id": user_id },
      { $set: { interest_status: true } },
      { new: true }
    );

    res.status(201).json({ message: "User interest skip successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
userController.updateProfile = async function (req, res) {
  try {
    const { user_id } = req.params;

    // Validate categories and subcategories before saving to the database
    const updatedUser = await User.findOneAndUpdate(
      { _id: user_id },
      { $set: req.body },
      { new: true }
    );

    res.status(201).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
userController.addProfessionalWorkImages = async function (req, res) {
  const createdImages = [];
  const { image_urls, user_id } = req.body;
  console.log(image_urls.length);
  try {
    const workImage = await ProfessionalWorkImages.findOne({ user_id: user_id }).sort({ _id: -1 })
    const existPriority = workImage ? workImage.priority : 1

    let i = 0
    for (const imageUrl of image_urls) {
      const createdImage = await ProfessionalWorkImages.create({
        image_urls: imageUrl,
        user_id: user_id,
        priority: existPriority + (++i),
      });
      createdImages.push(createdImage);
    }

    console.log("Professional image created:", createdImages);


    await ActivityModel.create({
      action: 'Work Images Updated',
      user: user_id
    });

    res.status(201).json({
      message: "Professional work image saved successfully",
      createdImages,
    });
  } catch (error) {
    console.error("Error creating professional image:", error.message);
    res.status(500).json({ message: error });
  }
};
userController.updatePriorityInProfessionalWorkImages = async function (req, res) {
  const bodyData = req.body.data;

  try {
    const updatedData = []
    for (let item of bodyData) {
      const updatedWork = await ProfessionalWorkImages.findOneAndUpdate(
        { "_id": item.work_id },
        { $set: { priority: item.priority, caption: item.caption } },
        { new: true }
      );
      updatedData.push(updatedWork)
    }
    console.log("Professional image updated:", updatedData);
    res.status(201).json({
      message: "Professional work image updated successfully",
      updatedData,
    });
  } catch (error) {
    console.error("Error creating professional image:", error.message);
    res.status(500).json({ message: error });
  }
};
userController.deleteProfessionalWorkImages = async function (req, res) {
  try {
    const professionalWorkImage =
      await ProfessionalWorkImages.findByIdAndDelete(req.params.id);
    if (professionalWorkImage) {
      res.json({ message: "Professional work images deleted successfully" });
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};





userController.getAllProfessionalWorkImages = async function (req, res) {
  try {
    // Get all Professional work images
    const professionalWorkUsers = await ProfessionalWorkImages.find({
      user_id: req.params.user_id,
    }).sort({ priority: -1 });
    // if (professionalWorkUsers.length>0) {
    res.json(professionalWorkUsers);
    // } else {
    //   res.status(404).json({ message: 'Professional user not found' });
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


userController.sortImage = async function (req, res) {
  const { index, image_urls } = req.body; // `index` is the priority number, not array index

  try {
    // Find the image with the given priority number (index)
    let targetImage = await ProfessionalWorkImages.findOne({ user_id: req.params.user_id, priority: index });

    if (!targetImage) {
      return res.status(404).json({ message: "No image found with the given priority" });
    }

    // Find the image with the given image URL
    let swapImage = await ProfessionalWorkImages.findOne({ user_id: req.params.user_id, image_urls });

    if (!swapImage) {
      return res.status(404).json({ message: "No image found with the given URL" });
    }

    // Swap their priority values
    let tempPriority = targetImage.priority;
    targetImage.priority = swapImage.priority;
    swapImage.priority = tempPriority;

    // Save changes
    await targetImage.save();
    await swapImage.save();

    res.json({ success: true, message: "Images swapped successfully" });
  } catch (error) {
    console.error("Sorting error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



userController.updatePrimarySalon = async function (req, res) {
  try {

    const { user_id } = req.params;
    const { salon_name } = req.body;

    // Check if salon_name already exists for another user
    if (salon_name) {
      const existingSalon = await User.findOne({
        _id: { $ne: user_id }, // Exclude the current user
        salon_name: salon_name, // Check for existing salon name
      });

      if (existingSalon) {
        return res.status(400).json({ success: false, message: "Business name already exists" });
      }
    }

    // If newCoordinates exist, update the location
    if (req.body.newCoordinates) {
      req.body["location.coordinates"] = req.body.newCoordinates;
    }

    // Update user data
    const result = await User.updateOne(
      { _id: user_id },
      { $set: req.body },
      { new: true }
    );

    await ActivityModel.create({
      action: 'Profile Updated',
      user: user_id
    });


    console.log("Primary salon updated successfully");
    res.status(201).json({ success: true, message: "Primary salon updated successfully" });

  } catch (error) {
    console.error("Error updating location:", error.message);
    res.status(500).json({ error: error.message });
  }
};


userController.sendCrypto = async function (req, res) {
  try {
    const { user_id, receipent, amount } = req.body;

    if (!user_id || !receipent || !amount) {
      return res.status(400).json({ success: false, message: "Missing required parameters." });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Decrypt the user's private key
    const bytes = crypto.AES.decrypt(user.privateKey, process.env.JWT_SECRET_KEY);
    const decryptedPrivateKey = bytes.toString(crypto.enc.Utf8);
    if (!decryptedPrivateKey) {
      return res.status(400).json({ success: false, message: "Invalid private key." });
    }

    // Initialize Web3
    const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
    const account = web3.eth.accounts.privateKeyToAccount(decryptedPrivateKey);
    web3.eth.accounts.wallet.add(account);

    // Prepare contract and transaction
    const tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
    const value = web3.utils.toWei(amount.toString(), 'mwei'); // or other unit if applicable
    const tx = tokenContract.methods.transfer(receipent, value);

    const gas = await tx.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();

    const txData = {
      from: account.address,
      to: TOKEN_ADDRESS,
      data: tx.encodeABI(),
      gas,
      gasPrice
    };

    const receipt = await web3.eth.sendTransaction(txData);

    res.status(201).json({ success: true, txHash: receipt.transactionHash });
  } catch (error) {
    console.error("Error in sendCrypto:", error.message);

    let errorMessage = "Transaction failed.";
    if (error.message?.includes("insufficient funds")) {
      errorMessage = "Insufficient balance to cover gas fees.";
    } else if (error.message?.includes("transfer amount exceeds balance")) {
      errorMessage = "Insufficient token balance.";
    } else {
      errorMessage = error.message;
    }

    res.status(500).json({ success: false, message: errorMessage });
  }
};



userController.claimAirdrop = async function (req, res) {
 
  const user = await User.findById(req.user.id);

  if(user.IsAirdropClaimed) {
    return res.status(400).json({ success: false, message: "Airdrop already claimed." });
  }

  user.IsAirdropClaimed = true;
  await user.save();

  res.status(200).json({ success: true, message: "Airdrop claimed successfully." });

};





userController.logoutUser = async function (req, res) {
  // req.logout();  
  // Destroy the session
  res.status(200).clearCookie('connect.sid', {
    path: '/'
  });
  req.session.destroy(function (err) {
    res.redirect('/');
  });
  return;
}

userController.addSubscribeEmail = async function (req, res) {
  try {
    const newSubscribe = new Subscribe(req.body);
    const savedSubscribe = await newSubscribe.save();
    await subscriberMail(req.body.email)
    res.status(201).json({ msg: 'Subscribe created successfully', savedSubscribe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
userController.resetPassword = async function (req, res) {
  try {
    const { user_id } = req.params
    const { current_password, password } = req.body

    const user = await User.findById({ "_id": user_id });
    const isPasswordValid = await bcrypt.compare(current_password, user.password);

    if (isPasswordValid) {

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await User.findOneAndUpdate(
        { "_id": user_id },
        { $set: { password: hashedPassword } },
        { new: true }
      );
      return res.status(201).json({ msg: 'User password updated successfully', updatedUser, success: true, });
    } else {
      return res.status(400).json({ success: false, message: 'Current password is not matching with existing password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
userController.forgotPassword = async function (req, res) {
  try {
    const { email } = req.body

    const user = await User.findOne({ "email": email });
    if (user) {
      const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generates a 6-digit OTP

      const updatedUser = await User.findOneAndUpdate(
        { "_id": user._id },
        { $set: { forgot_otp: otp } },
        { new: true }
      );
      // console.log(updatedUser,email)

      await forgotMail(user, otp)

      res.status(201).json({ msg: 'Mail sent successfully', user_id: user._id, success: true });
    } else {
      return res.status(400).json({ success: false, message: 'User Not Found!' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
userController.verifyOTPForForgot = async function (req, res) {
  try {
    const { otp, password, user_id } = req.body;

    const user = await User.findById({ "_id": user_id, forgot_otp: otp })

    if (!user) {
      return res.status(400).json({ success: false, message: 'OTP not generated for this email' });
    }
    if (Number(otp) === Number(user.forgot_otp)) {

      // Validate categories and subcategories before saving to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await User.findOneAndUpdate(
        { "_id": user_id },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY);

      await ActivityModel.create({
        action: 'User Reset Password',
        user: user._id
      });

      // Send the response
      return res.status(200).json({
        success: true,
        token,
        user: {
          ...user._doc,
          user_id: user._id,
        }
      });

    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

  } catch (err) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
userController.addInquiryEmail = async function (req, res) {
  try {
    const newInquiry = new Inquiry(req.body);
    const savedInquiry = await newInquiry.save();
    await inquiryrMail(req.body)
    res.status(201).json({ msg: 'Inquiry created successfully', savedInquiry, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
userController.generateBoardingLink = async function (req, res) {
  try {
    const user_id = req.params.user_id

    const stripeAccountData = await StripeSellerAccount.findOne({ user_id: user_id })
    let userOnboardedStatus = await checkUserOnboardingOrNot(stripeAccountData.account_id)

    if (!userOnboardedStatus) {
      const accountLink = await generateAccountlink(stripeAccountData.account_id)
      boarding_url = accountLink

      return res.status(201).json({ msg: 'User not onboarded', boarding_url, userOnboardedStatus });
    }
    return res.status(201).json({ msg: 'User already onboarded' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
// invite mail
userController.addInviteAndSendMail = async function (req, res) {
  try {
    const bodyData = req.body;

    console.log("-----------bodyData", bodyData)
    const newInvite = new Invite(bodyData);
    const savedInvite = await newInvite.save();

    // const user = await Invite.create({
    //   bodyData
    // });
    for (let item of bodyData.email_array) {
      const ob = {
        email: item,
        subject: bodyData.subject,
        body_msg: bodyData.body
      }
      await sendInviteMail(ob)
    }
    res
      .status(201)
      .json({ message: "User interest created successfully", savedInvite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
userController.addInviteAndSendMailByCSV = async function (req, res) {
  try {
    const bodyData = req.body;

    console.log("-----------bodyData", bodyData)
    const newInvite = new Invite(bodyData);
    const savedInvite = await newInvite.save();

    // const user = await Invite.create({
    //   bodyData
    // });
    for (let item of bodyData.email_array) {
      const ob = {
        email: item,
        subject: bodyData.subject,
        body_msg: bodyData.body
      }
      await sendInviteMail(ob)
    }
    res
      .status(201)
      .json({ message: "User interest created successfully", savedInvite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

userController.getInvite = async function (req, res) {
  try {
    const { user_id } = req.params;

    console.log("------------user_id", user_id)
    const inviteUser = await Invite.find({
      "seller_user_id": user_id
    })
      .sort({ created: -1 });
    res
      .status(201)
      .json(inviteUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

userController.allUsers = async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const skip = (page - 1) * limit;

    const users = await User.aggregate([
      {
        $addFields: {
          userTypePriority: { $cond: { if: { $eq: ["$user_type", "admin"] }, then: 1, else: 2 } }
        }
      },
      { $sort: { userTypePriority: 1, created: -1 } }, // Admins first, then by created date
      { $skip: skip },
      { $limit: limit }
    ]);


    const totalUsers = await User.countDocuments(); // Total count for pagination info

    res.json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};


userController.allTx = async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const skip = (page - 1) * limit;

    const users = await PaymentModel.find()
      .sort({ created: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await PaymentModel.countDocuments(); // Total count for pagination info

    res.json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};


userController.userActivity = async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const skip = (page - 1) * limit;

    const users = await ActivityModel.find({ user: req.query.id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await PaymentModel.countDocuments({ user: req.query.id }); // Total count for pagination info

    res.json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};


userController.adminUserDeatil = async function (req, res) {
  try {

    const user = await User.findById(req.query.id)

    const payments = await BookingService.find({
      seller_user_id: req.query.id,
      status: { $in: ["booked", "paid", "canceled", "completed"] }

    });


    const totalRevenue = payments.reduce((sum, payment) => sum + payment.orignal_price, 0);


    res.json({
      user,
      totalRevenue
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};


userController.accSuspension = async function (req, res) {
  try {

    const user = await User.findById(req.params.userId)

    user.isSuspended = !user.isSuspended

    await user.save()

    await ActivityModel.create({
      action: 'Suspends User Account',
      user: req.user._id
    });

    res.json({
      success: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};


userController.adminDelAccount = async function (req, res) {
  try {
    const { userId: user_id } = req.params;

    // Find the user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Check if the user has any active bookings (status: "booked" or "paid")
    const activeBookings = await BookingService.findOne({
      $or: [
        { seller_user_id: user_id, status: { $in: ["booked", "paid"] } }
      ]
    });

    if (activeBookings) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete account with upcoming bookings",
      });
    }

    // Delete related records
    await Slot.deleteMany({ salon_id: user_id });
    await Rating.deleteMany({ $or: [{ user_id }, { salon_id: user_id }] });
    await Products.deleteMany({ user_id });
    await Posts.deleteMany({ user_id });
    await Likes.deleteMany({ user_id });
    await Comments.deleteMany({ user_id });
    await BookingService.deleteMany({
      $or: [
        { customer_user_id: user_id },
        { appointment_ref: user_id },
        { seller_user_id: user_id }
      ]
    });

    // Delete the user
    await User.findByIdAndDelete(user_id);

    await ActivityModel.create({
      action: 'Delete User Account',
      user: req.user._id
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

userController.accSuspension = async function (req, res) {
  try {

    const user = await User.findById(req.params.userId)

    user.isSuspended = !user.isSuspended

    await user.save()

    await ActivityModel.create({
      action: 'Suspends User Account',
      user: req.user._id
    });

    res.json({
      success: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};




module.exports = userController;
