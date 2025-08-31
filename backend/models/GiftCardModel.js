const mongoose = require('mongoose');

// Define GiftCard schema
const GiftCardchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    totalAmount: {
        type: Number,
    },

    totalAmountLeft: {
        type: Number,
    },

    status: {
        type: String,
        enum: ['Active', 'Used'],
        default: 'Active'
    },

    code: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

});

const GiftCard = mongoose.model('GiftCard', GiftCardchema);

module.exports = GiftCard;
