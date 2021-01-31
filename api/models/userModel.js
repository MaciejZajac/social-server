const mongoose = require('mongoose');

const userCompanyModel = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
    },
    companyUrl: {
        type: String
    },
    linkedin: { type: String},
    shortDescription: {
        type: String
    },
    numberOfOffers: {
        type: Number,
        default: 0,
    },
    hasCompanyProfile: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    activeToken: String,
    activeExpires: Date
}, {
    
    timestamps: true

}) 

module.exports = mongoose.model("User", userCompanyModel);
