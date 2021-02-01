const mongoose = require('mongoose');

const offerModel = mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    pensionFrom: {
        type: Number,
        required: true
    },
    pensionTo: {
        type: Number,
        required: true
    },
    requiredSkills: [
        {
            type: String
        }
    ],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
}) 

module.exports = mongoose.model("Offer", offerModel);
