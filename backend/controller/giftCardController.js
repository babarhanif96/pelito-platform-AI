
const { ADMIN_ADDRESS, RPC_URL, TOKEN_ADDRESS, TOKEN_ABI } = require("../constant");
const GiftCard = require("../models/GiftCardModel");
const User = require("../models/usersModel");
const crypto = require('crypto-js');
const Web3 = require('web3');


var cardController = {};

cardController.createCard = async function (req, res) {
  try {
    const { amount } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Initialize Web3 provider
    const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

    // Decrypt the user's private key
    const bytes = crypto.AES.decrypt(user.privateKey, process.env.JWT_SECRET_KEY);
    const decryptedPrivateKey = bytes.toString(crypto.enc.Utf8);
    if (!decryptedPrivateKey) {
      return res.status(400).json({ success: false, message: "Invalid private key." });
    }

    // Add the user's account to web3 wallet
    const account = web3.eth.accounts.privateKeyToAccount(decryptedPrivateKey);
    web3.eth.accounts.wallet.add(account);

    const tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);

    // Get user's token balance
    const balance = await tokenContract.methods.balanceOf(user.address).call();
    const formattedBalance = Number(web3.utils.fromWei(balance, 'mwei'));

    if (formattedBalance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient tokens to create gift card."
      });
    }

    // Prepare the amount in Wei
    const parsedAmount = web3.utils.toWei(amount.toString(), 'mwei');

    // Estimate gas for transfer
    const gasEstimate = await tokenContract.methods.transfer(ADMIN_ADDRESS, parsedAmount).estimateGas({ from: account.address });

    // Get current gas price
    const gasPrice = await web3.eth.getGasPrice();

    // Get user's ETH balance
    const ethBalanceWei = await web3.eth.getBalance(account.address);

    const totalGasCost = BigInt(gasEstimate) * BigInt(gasPrice);
    if (BigInt(ethBalanceWei) < totalGasCost) {
      return res.status(400).json({
        success: false,
        message: "Insufficient funds to cover gas fees."
      });
    }

    // Execute the token transfer
    const tx = {
      from: account.address,
      to: TOKEN_ADDRESS,
      gas: gasEstimate,
      gasPrice,
      data: tokenContract.methods.transfer(ADMIN_ADDRESS, parsedAmount).encodeABI()
    };

    await web3.eth.sendTransaction(tx);

    // Generate and encrypt gift card code
    const plainCode = Math.random().toString(36).slice(2, 7) + Math.random().toString(36).slice(2, 7);
    const encryptedCode = crypto.AES.encrypt(plainCode, process.env.GIFT_CARD_SECRET_KEY).toString();

    // Save gift card
    const giftCard = new GiftCard({
      user: req.user.id,
      totalAmount: amount,
      totalAmountLeft: amount,
      code: encryptedCode
    });

    await giftCard.save();

    return res.status(200).json({ success: true });

  } catch (error) {
    console.log("Gift card creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};


cardController.getAllGiftCardsForUser = async function (req, res) {
    try {
        const userId = req.user.id;

        const giftCards = await GiftCard.find({ user: userId });

        if (!giftCards || giftCards.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Decrypt the codes before sending
        const decryptedGiftCards = giftCards.map(card => {
            const bytes = crypto.AES.decrypt(card.code, process.env.GIFT_CARD_SECRET_KEY);
            const decryptedCode = bytes.toString(crypto.enc.Utf8);
            return {
                ...card.toObject(),
                code: decryptedCode // replace encrypted code with decrypted code
            };
        });

        return res.status(200).json({ success: true, data: decryptedGiftCards });

    } catch (error) {
        console.log("Error fetching gift cards:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}


cardController.verifyCode = async function (req, res) {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ success: false, message: "Code is required." });
        }

        const giftCards = await GiftCard.find({});

        // Find matching decrypted code
        const giftCard = giftCards.find(card => {
            const bytes = crypto.AES.decrypt(card.code, process.env.GIFT_CARD_SECRET_KEY);
            const decryptedCode = bytes.toString(crypto.enc.Utf8);
            return decryptedCode === code;
        }); 

        if (!giftCard) {
            return res.status(404).json({ success: false, message: "Invalid code." });
        }

        if (giftCard.totalAmountLeft <= 0) {
            return res.status(400).json({ success: false, message: "Gift card has no balance left." });
        }

        return res.status(200).json({ success: true, data: giftCard });

    } catch (error) {
        console.log("Error verifying code:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}



module.exports = cardController;
