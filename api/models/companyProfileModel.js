const mongoose = require('mongoose');

const companyProfile = mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    companyDescription: {
        type: String,
        required: true
    },
    technologiesUsed: [{type: String, required: true}],
    
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
}) 

module.exports = mongoose.model("CompanyProfile", companyProfile);
