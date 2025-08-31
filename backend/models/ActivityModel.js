const mongoose = require('mongoose');

// Define the schema for the Ad_Views table
const activitySchema = new mongoose.Schema({

    action : {
        type: String,
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date : {
        type: Date,
        default: Date.now
    }

});

// Create the Ad_Views model
const AdViews = mongoose.model('Activity', activitySchema);

module.exports = AdViews;
