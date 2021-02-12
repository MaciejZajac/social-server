const mongoose = require('mongoose');

const companyProfile = mongoose.Schema(
    {
        companyDescription: {
            type: String,
            required: true,
        },
        technologiesUsed: [
            {
                type: String,
            },
        ],
        companyOffers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Offer',
            },
        ],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('CompanyProfile', companyProfile);
