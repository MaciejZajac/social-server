const mongoose = require('mongoose');

const offerModel = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
}) 

module.exports = mongoose.model("Offer", offerModel);
