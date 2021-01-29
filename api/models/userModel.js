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
}, {
    
    timestamps: true

}) 

module.exports = mongoose.model("User", userCompanyModel);
