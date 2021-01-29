const mongoose = require('mongoose');

const userDeveloperModel = mongoose.Schema({
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
        type:String,
        required: true
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    portfolioUrl: {
        type: String
    },
    technologyUsed: [
        {
            type: String
        }
    ]
}, {
    timestamps: true
}) 

module.exports = mongoose.model("Developer", userDeveloperModel);
