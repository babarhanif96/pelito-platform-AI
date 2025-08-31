const ProfessionalService = require("../models/professionalServiceModel");
const BookingService = require("../models/bookingServiceModel");
const Slot = require("../models/slotModel");
const Payment = require("../models/paymentModel");
const
  {
    sellerMemberEmail,
    sellerEmail,
    customerEmail,
    customerEmailForCancel,
    sellerEmailForCancel,
    sellerMemberEmailForCancel,
    sendRecurringMail
  } = require("../utils/email");

const Secret_Api_Key = process.env.Secret_Api_Key
const stripe = require('stripe')(Secret_Api_Key);
const moment = require('moment');
const { isDateDifferenceOneDay } = require("../utils/common");
const StripeSellerAccount = require("../models/stripeSellerAccountModel");
const { createCustomerAndTransfer, createCustomerAndTransferForNetwork, cancelAndRefund } = require("../utils/stripe");
const ActivityModel = require('../models/ActivityModel');
const { RPC_URL, TOKEN_ADDRESS, TOKEN_ABI } = require("../constant");
const GiftCard = require("../models/GiftCardModel");
const crypto = require('crypto-js');
const Web3 = require('web3');



var serviceController = {};

// Service
serviceController.addService = async function (req, res) {
  try {

    console.log(req.body)

    if (!req.body.user_id) {
      return res.status(400).json({ message: "Please provide the user_id." });
    }



    const newService = new ProfessionalService(req.body);
    const savedService = await newService.save();

    await ActivityModel.create({
      user_id: req.body.user_id,
      activity_type: 'Created an Service',
    })

    res.status(201).json({ msg: "Service created successfully", savedService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
serviceController.getServiceById = async function (req, res) {
  try {
    const service = await ProfessionalService.findById(req.params.id).sort({ created: -1 });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
serviceController.getServiceByUserId = async function (req, res) {
  try {
    const service = await ProfessionalService.find({
      user_id: req.params.user_id,
    }).sort({ created: -1 }); // Sort by created_at in descending order
    // if (service) {
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
serviceController.updateService = async function (req, res) {
  try {
    const updatedService = await ProfessionalService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedService) {
      res
        .status(200)
        .json({ msg: "Service updated successfully", updatedService });
    } else {
      res.status(404).json({ message: "Interest Service not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


serviceController.deleteService = async function (req, res) {
  try {

    await BookingService.deleteMany({ service_id: req.params.id });

    const deletedService = await ProfessionalService.findByIdAndDelete(
      req.params.id
    );
    if (deletedService) {
      res.json({ message: "Service deleted successfully" });
    } else {
      res.status(404).json({ message: "Service not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


serviceController.addBooking = async function (req, res) {
  try {
    const { day, time, price, customer_user_id, seller_user_id, service_id, other_charges, slot_id, member_id, booking_time, slot_date, booking_user_type, appointment_ref = null } = req.body;

    const booking = {
      booking_id: `PELITO${Math.floor(Math.random() * 90000) + 10000}`,
      orignal_price: price,
      customer_user_id,
      seller_user_id,
      member_id,
      service_id,
      tax: 8.99,
      other_charges,
      total_amount: price + process.env.professional_service_fee + other_charges ? other_charges : 0,
      day,
      time,
      slot_id,
      booking_time,
      slot_date,
      payment_mode: booking_user_type,
      appointment_ref
    }

    const newService = new BookingService(booking);
    const savedService = await newService.save();



    // const updatedSlot = await Slot.findByIdAndUpdate(
    //   slot_id,
    //   {$inc:{capacity:-1}},
    //   { new: true }
    // );

    res.status(201).json({ msg: "Booking created successfully", savedService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
serviceController.updateBooking = async function (req, res) {
  try {
    const { booking_id, day, time } = req.body
    const updatedService = await BookingService.updateMany(
      { _id: booking_id },
      { $set: { day, time } },
      { new: true }
    );

    res.status(200).json({ msg: "Service updated successfully", updatedService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
serviceController.getBookingServices = async function (req, res) {
  try {
    const services = await BookingService.find({
      $or: [
        { customer_user_id: req.params.user_id },
        { appointment_ref: req.params.user_id }
      ],
      status: "pending",
    })
      .populate('service_id')
      .populate('customer_user_id')
      .populate('seller_user_id')
      .populate('appointment_ref')
      .sort({ created: -1 }); // Sort by created_at in descending order

    // Check if all sellers have isStripeEnabled = true
    const isGlobalStripeEnabled = services.every(service => service.seller_user_id?.IsStripeEnabled);

    res.status(200).json({ services, isGlobalStripeEnabled });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



serviceController.addPayment = async function (req, res) {

  const { booking_id_array, email, name } = req.body;
  let paymentDataRes = []

  let i = 0
  try {
    const bookingData = await BookingService.findOne({ "_id": booking_id_array[0].booking_id })

    for (let item of booking_id_array) {
      const { network_fee_amount, service_amount, booking_id, token_platform, token_account } = item

      const stripeData = await StripeSellerAccount.findOne({ user_id: bookingData.seller_user_id })
      let destinationAccountId = ''

      console.log("-----------------stripeData", stripeData)
      destinationAccountId = stripeData.account_id ? 'acct_1OrZ56C1IhSKjq2M' : 'acct_1OrZ56C1IhSKjq2M'


      const transfer = await createCustomerAndTransferForNetwork(token_platform, network_fee_amount, name, email)
      const transfer2 = await createCustomerAndTransfer(token_account, service_amount, destinationAccountId)

      console.log("----------------------transfer", transfer)
      console.log("----------------------transfer2", transfer2)

      const paymentData = {
        payment_id: transfer2.id,
        receipt_url: transfer2.receipt_url,
        booking_id: booking_id,
        price: service_amount,
        type: 'service'
      }
      const payment = new Payment(paymentData);
      const savedPayment = await payment.save();

      paymentDataRes.push(savedPayment)
      //Send email to user & seller
      const mailData = await prepareInvoiceAndMailData(booking_id)

      await customerEmail(mailData[0])
      await sellerEmail(mailData[0])
      await sellerMemberEmail(mailData[0])
      i++

      if (booking_id_array.length == i) {
        const booking_ids = booking_id_array.map((val) => val.booking_id)
        const updatedService = await BookingService.updateMany(
          { _id: { $in: booking_ids } },
          { $set: { status: "booked", } },
          { new: true }
        );
        return res.json({ msg: 'payment created successfully', paymentDataRes });

      }

    }

  } catch (err) {
    console.log(err)
  }
}


serviceController.sendTip = async function (req, res) {

  const { booking_id, service_amount, token_account } = req.body;


  try {
    const bookingData = await BookingService.findOne({ "_id": booking_id })

    const stripeData = await StripeSellerAccount.findOne({ user_id: bookingData.seller_user_id })
    let destinationAccountId = ''

    console.log("-----------------stripeData", stripeData)
    destinationAccountId = stripeData.account_id ? 'acct_1OrZ56C1IhSKjq2M' : 'acct_1OrZ56C1IhSKjq2M'

    const transfer2 = await createCustomerAndTransfer(token_account, service_amount, destinationAccountId)

    console.log("----------------------transfer2", transfer2)

    return res.json({ msg: 'payment sent successfully' });

  } catch (err) {
    console.log(err)
  }
}

const validateTokenTransaction = async (txHash, recipientAddress, expectedAmount) => {
  try {
    console.log("Validating transaction:", txHash, recipientAddress, expectedAmount);

    const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

    const tx = await web3.eth.getTransaction(txHash);
    if (!tx) {
      return { success: false, message: "Transaction not found." };
    }

    console.log("Transaction details:", tx);

    if (tx.to.toLowerCase() !== TOKEN_ADDRESS.toLowerCase()) {
      return { success: false, message: "Transaction not sent to the correct token contract." };
    }

    // Correct way to decode input data for transfer(address,uint256)
    const decoded = web3.eth.abi.decodeParameters(['address', 'uint256'], tx.input.slice(10));

    const to = decoded[0];
    const amount = decoded[1];

    const isRecipientValid = to.toLowerCase() === recipientAddress.toLowerCase();
    const expectedValue = web3.utils.toWei(expectedAmount.toString(), 'mwei');
    const isAmountValid = web3.utils.toBN(amount).eq(web3.utils.toBN(expectedValue));

    if (!isRecipientValid) {
      return { success: false, message: "Invalid recipient address." };
    }

    if (!isAmountValid) {
      return { success: false, message: "Invalid transaction amount." };
    }

    const receipt = await web3.eth.getTransactionReceipt(txHash);
    if (!receipt || !receipt.status) {
      return { success: false, message: "Transaction failed or not confirmed." };
    }

    return { success: true, message: "Transaction validated successfully." };

  } catch (error) {
    console.error(error);
    return { success: false, message: "Error validating transaction." };
  }
};



serviceController.addPaymentCrypto = async function (req, res) {
  const { booking_id_array, email, name, hash: tx, amount: value, code } = req.body;

  let paymentDataRes = [];
  let i = 0;

  let amount = Number(value);
  let hash = tx;

  try {
    const bookingData = await BookingService.findOne({ "_id": booking_id_array[0].booking_id }).populate('seller_user_id');
    const sellerAddress = bookingData.seller_user_id.address;

    let giftCard = null;

    if (code) {
      const giftCards = await GiftCard.find({});
      for (const card of giftCards) {
        const bytes = crypto.AES.decrypt(card.code, process.env.GIFT_CARD_SECRET_KEY);
        const decryptedCode = bytes.toString(crypto.enc.Utf8);
        if (decryptedCode === code) {
          giftCard = card;
          break;
        }
      }

      if (!giftCard) {
        return res.status(404).json({ success: false, message: "Invalid code." });
      }

      if (Number(giftCard.totalAmountLeft) <= 0) {
        return res.status(400).json({ success: false, message: "Gift card has no balance left." });
      }

      const giftCardUsed = Math.min(amount, Number(giftCard.totalAmountLeft));

      // Send tokens from admin to seller using Web3
      if (giftCardUsed > 0) {
        const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
        const PRIVATE_KEY = process.env.PRIVATE_KEY;
        const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
        web3.eth.accounts.wallet.add(account);

        const tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
        const valueToSend = web3.utils.toWei(giftCardUsed.toString(), 'mwei');

        const txData = {
          from: account.address,
          to: TOKEN_ADDRESS,
          data: tokenContract.methods.transfer(sellerAddress, valueToSend).encodeABI(),
          gas: await tokenContract.methods.transfer(sellerAddress, valueToSend).estimateGas({ from: account.address }),
          gasPrice: await web3.eth.getGasPrice()
        };

        await web3.eth.sendTransaction(txData);
      }

      // Update gift card balance
      giftCard.totalAmountLeft = Math.max(Number(giftCard.totalAmountLeft) - giftCardUsed, 0);
      if (giftCard.totalAmountLeft === 0) {
        giftCard.status = 'Used';
      }

      await giftCard.save();

      amount = amount - giftCardUsed;
    }

    // Validate transaction from user if remaining amount is not 0
    if (amount > 0) {
      const x = await validateTokenTransaction(hash, sellerAddress, amount);
      if (!x.success) {
        return res.status(400).json({ message: x.message });
      }
    }

    // Save payments and update bookings
    for (let item of booking_id_array) {
      const { service_amount, booking_id } = item;

      const paymentData = {
        payment_id: hash,
        receipt_url: '',
        booking_id: booking_id,
        price: service_amount,
        type: 'service'
      };

      const payment = new Payment(paymentData);
      const savedPayment = await payment.save();
      paymentDataRes.push(savedPayment);

      const mailData = await prepareInvoiceAndMailData(booking_id);
      await customerEmail(mailData[0]);
      await sellerEmail(mailData[0]);
      await sellerMemberEmail(mailData[0]);

      i++;

      if (booking_id_array.length === i) {
        const booking_ids = booking_id_array.map(val => val.booking_id);
        await BookingService.updateMany(
          { _id: { $in: booking_ids } },
          { $set: { status: "booked", isCrypto: true } },
          { new: true }
        );

        console.log("✅ All bookings updated to booked status");
        return res.json({ msg: 'Payment created successfully', paymentDataRes });
      }
    }
  } catch (err) {
    console.log("❌ Error in addPaymentCrypto:", err);
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};


serviceController.getMySalons = async function (req, res) {
  try {
    const service = await BookingService.find({
      seller_user_id: req.params.user_id,
      $or: [{ status: "booked" }, { status: "paid" }],
    })
      // .populate('user_id')
      .populate('slot_id')
      .sort({ created: -1 })// Sort by created_at in descending order

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
serviceController.deleteBookingService = async function (req, res) {
  try {
    const { slot_id } = req.body
    const deletedService = await BookingService.findByIdAndDelete(
      req.params.id
    );
    const updatedSlot = await Slot.findByIdAndUpdate(
      slot_id,
      { $inc: { capacity: 1 } },
      { new: true }
    );

    if (deletedService) {
      res.json({ message: "Booking Service deleted successfully" });
    } else {
      res.status(404).json({ message: "Booking Service not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

serviceController.getBookedBookingServicesByMemberId = async function (req, res) {
  try {
    const service = await BookingService.find({
      member_id: req.params.member_id,
      status: { $in: ["booked", "paid"] }
    })
      .populate('service_id')
      .populate('customer_user_id')
      .populate('member_id')
      .populate('seller_user_id')
      .populate('slot_id')
      .sort({ created: -1 })// Sort by created_at in descending order
      .lean()

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

serviceController.getBookedServicesByCustomer = async function (req, res) {
  try {
    const { status } = req.query;

    let statusFilter;
    if (status === "Upcoming") {
      statusFilter = { $in: ["booked", "paid"] };
    } else if (status === "Cancelled") {
      statusFilter = "canceled";
    } else if (status === "Completed") {
      statusFilter = "completed";
    }

    const filter = {
      customer_user_id: req.params.user_id,
      ...(statusFilter && { status: statusFilter }) // Only add status if it exists
    };

    const service = await BookingService.find(filter)
      .populate('service_id')
      .populate('customer_user_id')
      .populate('member_id')
      .populate('seller_user_id')
      .populate('slot_id')
      .sort({ created: -1 }) // Sort by created_at in descending order
      .lean();

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

serviceController.getCompletedBookingServicesByCustomer = async function (req, res) {
  try {
    const service = await BookingService.find({
      customer_user_id: req.params.user_id,
      status: "completed",
    })
      .populate('service_id')
      .populate('customer_user_id')
      .populate('member_id')
      .populate('seller_user_id')
      .populate('slot_id')
      .sort({ created: -1 })// Sort by created_at in descending order
      .lean()

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
serviceController.getCancelBookingServicesByCustomer = async function (req, res) {
  try {
    const service = await BookingService.find({
      customer_user_id: req.params.user_id,
      status: "canceled",
    })
      .populate('service_id')
      .populate('customer_user_id')
      .populate('member_id')
      .populate('seller_user_id')
      .populate('slot_id')
      .sort({ created: -1 })// Sort by created_at in descending order
      .lean()

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
serviceController.cnaceledTheBooking = async function (req, res) {
  try {

    const { cancel_status } = req.body
    const { booking_id } = req.params

    const currentDate = new Date().toISOString().slice(0, 10);

    const bookingData = await BookingService.findById({ "_id": booking_id }).populate('slot_id')

    console.log(bookingData.slot_id.slot_Date)
    const checkDayDiff = isDateDifferenceOneDay(bookingData.created, currentDate)

    // if (!checkDayDiff && !cancel_status) {
    //   return res.status(200).json({ message: "We regret to inform you that we are unable to proceed with your refund request as it was made more than 24 hours ago. Our refund policy stipulates that refunds can only be processed within the first 24 hours of the purchase." });
    // }

    const updatedService = await BookingService.findByIdAndUpdate(
      { _id: booking_id },
      { $set: { status: "canceled", }, canceled_by: 'customer' },
      { new: true }
    );
    let msg = ''
    // refund code
    if (!checkDayDiff && cancel_status) {
      // not possible refund
      msg = "Booking canceled successfully"
    } else {

      // const paymentData = await Payment.findOne({booking_id:booking_id})
      // console.log("--------------paymentData",paymentData)
      // const charge = await cancelAndRefund(paymentData.payment_id)

      // console.log('Refund details:', charge);
      // if(charge.status == 'succeeded'){
      msg = "Booking canceled successfully, refund will be proceed sortly"
      // }else{
      //   msg = "Booking canceled successfully, but refund fail , please give some time so we can proceed"
      // }

    }
    const mailData = await prepareInvoiceAndMailData(booking_id)
    // console.log(mailData)
    await customerEmailForCancel(mailData[0])
    await sellerEmailForCancel(mailData[0])
    await sellerMemberEmailForCancel(mailData[0])

    res.status(200).json({ msg, updatedService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
serviceController.cnaceledTheBookingBySalon = async function (req, res) {
  try {

    const { booking_id } = req.params

    const currentDate = new Date()

    const updatedService = await BookingService.findByIdAndUpdate(
      { _id: booking_id },
      { $set: { status: "canceled" }, updated: currentDate, canceled_by: 'salon' },
      { new: true }
    );
    // refund process
    let msg = "Booking canceled successfully, refund will be proceed sortly"

    // const paymentData = await Payment.findOne({ booking_id: booking_id })
    // console.log("--------------paymentData", paymentData)
    // await cancelAndRefund(paymentData.payment_id)

    const mailData = await prepareInvoiceAndMailData(booking_id)

    await customerEmailForCancel(mailData[0])
    await sellerEmailForCancel(mailData[0])
    await sellerMemberEmailForCancel(mailData[0])

    res.status(200).json({ msg, updatedService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
serviceController.getReportForSalon = async function (req, res) {
  try {

    let query = {}
    if (req.query.created_date) {
      const createdDate = new Date(req.query.created_date);
      const nextDate = new Date(createdDate);
      nextDate.setDate(createdDate.getDate() + 1); // Get the next day

      query.created = {
        $gte: createdDate, // Greater than or equal to '2024-02-05 00:00:00.000'
        $lt: nextDate    // Less than '2024-02-06 00:00:00.000'
      }
    }
    query.seller_user_id = req.params.salon_id
    query.status = "completed"
    console.log(query)
    const service = await BookingService.find(query)
      .populate('service_id')
      .populate('customer_user_id')
      .populate('member_id')
      .populate('seller_user_id')
      .populate('slot_id')
      .sort({ created: -1 })// Sort by created_at in descending order
      .lean()

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

serviceController.updateRecurringStatus = async function (req, res) {
  try {
    const { booking_id } = req.params
    const { recurring_status, recurring_type, card_no, cv, exp_month, exp_year } = req.body

    const updateBooking = await BookingService.findByIdAndUpdate(
      booking_id,
      { recurring_status: recurring_status, recurring_type, card_no, cv, exp_month, exp_year },
      { new: true }
    );
    //send mail
    const mailData = await prepareInvoiceAndMailData(booking_id)

    await sendRecurringMail(mailData[0], recurring_status)
    res.status(200).json({ msg: `Recurring ${recurring_status ? 'enable' : 'disable'}`, updateBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
serviceController.updateBookingStatusForOffline = async function (req, res) {
  try {
    const { booking_ids } = req.body

    const updateBooking = await BookingService.updateMany(
      { "_id": { $in: booking_ids } },
      { status: 'paid' },
      { new: true }
    );

    res.status(200).json({ msg: 'Booking status paid is updated', updateBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

serviceController.getBookedServicesBySeller = async function (req, res) {
  try {
    const { memberId } = req.query;
    const filter = {
      seller_user_id: req.params.user_id,
      status: { $in: ["booked", "paid", "canceled", "completed"] }
    };

    if (memberId) {
      filter.member_id = memberId;
    }

    const service = await BookingService.find(filter)
      .populate('service_id')
      .populate('customer_user_id')
      .populate('member_id')
      .populate('seller_user_id')
      .populate('slot_id')
      .sort({ created: -1 }) // Sort by created_at in descending order
      .lean();

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function prepareInvoiceAndMailData(booking_id_array) {
  const bookingService = await BookingService.find({ _id: { $in: booking_id_array } })
    .populate('service_id')
    .populate('customer_user_id')
    .populate('member_id')
    .populate('seller_user_id')
    .populate('slot_id')
    .lean()
  const bookingData = []
  for (let item of bookingService) {
    const ob = {
      booking_time: item.booking_time,
      booking_date: moment(item.slot_id.slot_date).format('DD MMM YYYY'),
      salon_name: item.seller_user_id.first_name + ' ' + item.seller_user_id.last_name,
      // booking_time:item.booking_time,
      customer_name: item.customer_user_id.first_name + ' ' + item.customer_user_id.last_name,
      member_name: item.member_id.first_name + ' ' + item.member_id.last_name,
      customer_email: item.customer_user_id.email,
      member_email: item.member_id.email,
      seller_email: item.seller_user_id.email,
      service_name: item.service_id.service_name
    }
    bookingData.push(ob)
  }
  return bookingData
}

serviceController.updateBookingStatus = async function (req, res) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set to start of the day

  // Update only records where status is NOT already 'completed'
  const result = await BookingService.updateMany(
    { day: { $lt: currentDate }, status: { $ne: 'completed' } },
    { $set: { status: 'completed' } }
  );

  res.json({
    message: `Updated ${result.modifiedCount} BookingService records.`,
  })
}

module.exports = serviceController;
