const Cart = require("../models/cartModel");
const Payment = require("../models/paymentModel");
const Products = require("../models/productModel");
const ShippingAddress = require("../models/shippingAddressModel");
const Secret_Api_Key = process.env.Secret_Api_Key
const stripe = require('stripe')(Secret_Api_Key);
const moment = require('moment');
const { isDateDifferenceOneDay } = require("../utils/common");
const { createCustomerAndTransfer, generateAccountIdForSeller, createCustomerAndTransferForNetwork } = require("../utils/stripe");
const StripeSellerAccount = require("../models/stripeSellerAccountModel");
const Rating = require("../models/ratingModel");

const { RPC_URL, ADMIN_ADDRESS, TOKEN_ADDRESS, TOKEN_ABI } = require("../constant");
const GiftCard = require("../models/GiftCardModel");
const crypto = require('crypto-js');
const Web3 = require('web3');


var productController = {};

// Product
productController.addProduct = async function (req, res) {
  try {
    const newProduct = new Products(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({ msg: 'Product created successfully', savedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
productController.getProductById = async function (req, res) {
  try {
    const product = await Products.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
productController.getAllProductByUserId = async function (req, res) {
  try {
    const product = await Products.find({ user_id: req.params.user_id }).sort({ created: -1 });;
    console.log(product)
    const productIdArray = product.map((val) => val._id)
    const ratingResult = await Rating.aggregate([
      {
        $match: { product_id: { $in: productIdArray } },
      },
      {
        $group: {
          _id: '$product_id',
          avgRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const resultMap = {}


    for (let item of ratingResult) {
      resultMap[item._id] = item
    }
    console.log("ratingResult", resultMap)

    let finalResult = []

    for (let item of product) {
      const rating = resultMap[item._id]
      console.log(rating, item._id)
      finalResult.push({ item, rating })
    }

    res.json(finalResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
productController.updateProduct = async function (req, res) {
  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedProduct) {
      res.status(200).json({ msg: 'Product updated successfully', updatedProduct });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
productController.deleteProduct = async function (req, res) {
  try {
    const deletedProducts = await Products.findByIdAndDelete(req.params.id);
    if (deletedProducts) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Cart
productController.addToCart = async function (req, res) {
  try {

    const { customer_user_id, product_id, price, quantity } = req.body

    const cartData = await Cart.findOne({ customer_user_id: customer_user_id, product_id: product_id, status: 'pending' })

    if (cartData) {
      const final_quantity = cartData.quantity + quantity
      const final_price = cartData.price + price
      const professional_product_fee = 3 * final_quantity

      const updatedCart = await Cart.findByIdAndUpdate(
        cartData._id,
        { quantity: final_quantity, price: final_price, professional_product_fee },
        { new: true }
      );
      res.status(201).json({ msg: 'Product quantity updated successfully', updatedCart });

    } else {
      const newCart = new Cart(req.body);
      const savedCart = await newCart.save();
      res.status(201).json({ msg: 'Product added in cart created successfully', savedCart });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
productController.getCartDetails = async function (req, res) {
  try {
    const cart = await Cart.find({ customer_user_id: req.params.user_id, status: 'pending' }).populate('product_id').populate('seller_user_id');

    // Check if all sellers have isStripeEnabled = true
    const isGlobalStripeEnabled = cart.every(cart => cart.seller_user_id?.IsStripeEnabled);

    res.status(201).json({ cart, isGlobalStripeEnabled });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
productController.updateCart = async function (req, res) {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedCart) {
      res.status(200).json({ msg: 'Cart updated successfully', updatedCart });
    } else {
      res.status(404).json({ message: 'Product not cound in cart' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
productController.deleteProductFromCart = async function (req, res) {
  try {
    const deletedProducts = await Cart.findByIdAndDelete(req.params.id);
    if (deletedProducts) {
      res.json({ message: 'Product deleted successfully from cart' });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

productController.addPaymentForProduct = async function (req, res) {

  const { cart_id_array, email, name } = req.body;
  let paymentDataRes = []


  const cartData = await Cart.findOne({ "_id": cart_id_array[0].cart_id })

  console.log(cart_id_array[0].cart_id)
  let i = 0
  for (let item of cart_id_array) {
    const { network_fee_amount, product_amount, cart_id, token_platform, token_account } = item

    const stripeData = await StripeSellerAccount.findOne({ user_id: cartData.seller_user_id })

    destinationAccountId = stripeData.account_id ? 'acct_1OrZ56C1IhSKjq2M' : 'acct_1OrZ56C1IhSKjq2M'


    const transfer = await createCustomerAndTransferForNetwork(token_platform, network_fee_amount, name, email)
    const transfer2 = await createCustomerAndTransfer(token_account, product_amount, destinationAccountId)

    console.log("----------------------transfer", transfer)
    console.log("----------------------transfer2", transfer2)

    const paymentObj = {
      payment_id: transfer2.id,
      receipt_url: transfer2.receipt_url,
      cart_id: cart_id,
      price: product_amount,
      type: 'product'

    }
    const payment = new Payment(paymentObj);
    const savedPayment = await payment.save();

    //Send email to user & seller
    // const mailData = await prepareInvoiceAndMailData(booking_id_array)

    // for(let item of mailData){
    //   await customerEmail(item)
    //   await sellerEmail(item)
    //   await sellerMemberEmail(item) 
    // }
    i++
    paymentDataRes.push(savedPayment)
    console.log("--------------cart_ids", cart_id_array.length, i, cart_id_array.length == i)

    if (cart_id_array.length == i) {
      const cart_ids = cart_id_array.map((val) => val.cart_id)
      console.log("--------------cart_ids", cart_id_array, cart_ids)
      const updatedCart = await Cart.updateMany(
        { _id: { $in: cart_ids } },
        { $set: { status: "paid", } },
        { new: true }
      );
      return res.json({ msg: 'payment created successfully', paymentDataRes });

    }
  }
}


const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

const validateTokenTransaction = async (txHash, recipientAddress, expectedAmount) => {
  try {
    // Get the transaction
    const tx = await web3.eth.getTransaction(txHash);
    if (!tx) {
      return { success: false, message: "Transaction not found." };
    }

    // Check transaction is sent to the token contract
    if (tx.to.toLowerCase() !== TOKEN_ADDRESS.toLowerCase()) {
      return { success: false, message: "Transaction not sent to the correct token contract." };
    }

    // Decode the transaction input data
    const methodSignature = tx.input.slice(0, 10); // first 4 bytes of method
    const transferMethodSignature = web3.eth.abi.encodeFunctionSignature('transfer(address,uint256)');

    if (methodSignature !== transferMethodSignature) {
      return { success: false, message: "Invalid transaction method." };
    }

    const decoded = web3.eth.abi.decodeParameters(
      ['address', 'uint256'],
      tx.input.slice(10)
    );

    const to = decoded[0];
    const amount = decoded[1];

    // Check if recipient and amount are valid
    const isRecipientValid = to.toLowerCase() === recipientAddress.toLowerCase();
    const expectedInWei = web3.utils.toWei(expectedAmount.toString(), 'mwei'); // assumes 18 decimals
    const isAmountValid = web3.utils.toBN(amount).eq(web3.utils.toBN(expectedInWei));

    if (!isRecipientValid) {
      return { success: false, message: "Invalid recipient address." };
    }

    if (!isAmountValid) {
      return { success: false, message: "Invalid transaction amount." };
    }

    // Get the transaction receipt to confirm status
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    if (!receipt || !receipt.status) {
      return { success: false, message: "Transaction failed or not confirmed." };
    }

    return { success: true, message: "Transaction validated successfully." };

  } catch (error) {
    console.log(error);
    return { success: false, message: "Error validating transaction." };
  }
};



productController.addPaymentForProductCrypto = async function (req, res) {
  const { cart_id_array, email, name, hash: tx, amount: value, code } = req.body;

  let paymentDataRes = [];
  let i = 0;

  let amount = Number(value);
  let hash = tx;

  try {
    const cartData = await Cart.findOne({ "_id": cart_id_array[0].cart_id }).populate('seller_user_id');
    const sellerAddress = cartData.seller_user_id.address;

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
        return res.status(404).json({ success: false, message: "Invalid gift code." });
      }

      if (Number(giftCard.totalAmountLeft) <= 0) {
        return res.status(400).json({ success: false, message: "Gift card has no balance left." });
      }

      // Admin sends giftCardUsed amount to seller
      const giftCardUsed = Math.min(amount, Number(giftCard.totalAmountLeft));

      if (giftCardUsed > 0) {
        const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
        const PRIVATE_KEY = process.env.PRIVATE_KEY;
        const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
        web3.eth.accounts.wallet.add(account);

        const tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
        const valueToSend = web3.utils.toWei(giftCardUsed.toString(), 'mwei');

        const txObject = {
          from: account.address,
          to: TOKEN_ADDRESS,
          data: tokenContract.methods.transfer(sellerAddress, valueToSend).encodeABI(),
          gas: await tokenContract.methods.transfer(sellerAddress, valueToSend).estimateGas({ from: account.address }),
          gasPrice: await web3.eth.getGasPrice()
        };

        await web3.eth.sendTransaction(txObject);
      }

      // Update gift card balance
      giftCard.totalAmountLeft = Math.max(Number(giftCard.totalAmountLeft) - giftCardUsed, 0);
      if (giftCard.totalAmountLeft === 0) {
        giftCard.status = 'Used';
      }

      await giftCard.save();

      // Reduce the amount user needs to pay manually
      amount = amount - giftCardUsed;
    }

    // Validate token transaction only if user pays some amount
    if (amount > 0) {
      const x = await validateTokenTransaction(hash, sellerAddress, amount);
      if (!x.success) {
        return res.status(400).json({ message: x.message });
      }
    }

    // Save payments and update cart
    for (let item of cart_id_array) {
      const { network_fee_amount, product_amount, cart_id } = item;

      const paymentData = {
        payment_id: hash,
        receipt_url: '',
        cart_id,
        price: product_amount,
        type: 'product'
      };

      const payment = new Payment(paymentData);
      const savedPayment = await payment.save();
      paymentDataRes.push(savedPayment);

      i++;

      if (cart_id_array.length === i) {
        const cart_ids = cart_id_array.map(val => val.cart_id);

        await Cart.updateMany(
          { _id: { $in: cart_ids } },
          { $set: { status: "paid", isCrypto: true } },
          { new: true }
        );

        return res.json({ msg: 'Payment created successfully', paymentDataRes });
      }
    }
  } catch (err) {
    console.log("❌ Error in addPaymentForProductCrypto:", err);
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};


productController.getPaidProducts = async function (req, res) {
  try {
    const cart = await Cart.find({ customer_user_id: req.params.user_id, status: 'paid' }).populate('product_id').sort({ created: -1 });
    const productIdArray = cart.map((val) => val.product_id._id)
    // console.log("productIdArray ======= ",cart)
    const ratingResult = await Rating.aggregate([
      {
        $match: { product_id: { $in: productIdArray } },
      },
      {
        $group: {
          _id: '$product_id',
          avgRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const resultMap = {}


    for (let item of ratingResult) {
      resultMap[item._id] = item
    }
    console.log("ratingResult", resultMap)

    let finalResult = []

    for (let item of cart) {
      const rating = resultMap[item.product_id._id]
      // console.log(rating,item._id)
      finalResult.push({ item, rating })
    }

    res.status(201).json(finalResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
productController.getCanceledProducts = async function (req, res) {
  try {
    const cart = await Cart.find({ customer_user_id: req.params.user_id, status: 'canceled' }).populate('product_id');
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
productController.cancelOrder = async function (req, res) {
  try {

    const { cancel_status } = req.body
    const { cart_id } = req.params

    const currentDate = new Date().toISOString().slice(0, 10);
    console.log("_____cart_id", cart_id)

    const cartData = await Cart.findById({ "_id": cart_id })

    const checkDayDiff = isDateDifferenceOneDay(cartData.created, currentDate)

    if (!checkDayDiff && !cancel_status) {
      return res.status(200).json({ message: "We regret to inform you that we are unable to proceed with your refund request as it was made more than 24 hours ago. Our refund policy stipulates that refunds can only be processed within the first 24 hours of the purchase." });
    }
    const updatedService = await Cart.findByIdAndUpdate(
      { _id: cart_id },
      { $set: { status: "canceled", } },
      { new: true }
    );
    let msg = ''
    // refund code
    if (!checkDayDiff && cancel_status) {
      // not possible refund
      msg = "Order canceled successfully"
    } else {
      // console.log("---------------stripe",Secret_Api_Key)
      // const paymentData = await Payment.findOne({cart_id:cart_id})
      // // procced for refund
      // const refund = await stripe.refunds.create({
      //   payment_intent: paymentData.payment_id, // Or charge: paymentId if using Charge ID
      // });

      //   console.log('Refund details:', refund);

      msg = "Order canceled successfully, refund will be proceed sortly"

    }
    // const mailData = await prepareInvoiceAndMailData(booking_id)
    // // console.log(mailData)
    // await customerEmailForCancel(mailData[0])
    // await sellerEmailForCancel(mailData[0])
    // await sellerMemberEmailForCancel(mailData[0]) 

    res.status(200).json({ msg, updatedService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ShippingAddress
productController.addShippingAddress = async function (req, res) {
  try {
    const newShippingAddress = new ShippingAddress(req.body);
    const savedShippingAddress = await newShippingAddress.save();
    res.status(201).json({ msg: 'Shipping address created successfully', savedShippingAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
productController.getShippingAddressById = async function (req, res) {
  try {
    const ShippingAddress = await ShippingAddress.findById(req.params.id);
    if (ShippingAddress) {
      res.json(ShippingAddress);
    } else {
      res.status(404).json({ message: 'Shipping address not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
productController.getShippingAddressByUserId = async function (req, res) {
  try {
    const shippingAddress = await ShippingAddress.find({ user_id: req.params.user_id });

    res.json(shippingAddress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
productController.updateShippingAddress = async function (req, res) {
  try {
    const updatedShippingAddress = await ShippingAddress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedShippingAddress) {
      res.status(200).json({ msg: 'Shipping address updated successfully', updatedShippingAddress });
    } else {
      res.status(404).json({ message: 'Shipping address not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
productController.deleteShippingAddress = async function (req, res) {
  try {
    const deletedShippingAddress = await ShippingAddress.findByIdAndDelete(req.params.id);
    if (deletedShippingAddress) {
      res.json({ message: 'Shipping address deleted successfully' });
    } else {
      res.status(404).json({ message: 'Shipping address not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = productController