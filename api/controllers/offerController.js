const Offer = require('../models/offerModel');
const User = require('../models/userModel');

exports.createOffer = async (req, res, next) => {
    const { userId, email } = req.userData;
    const offer = new Offer({
        ...req.body,
        owner: userId,
    });

    try {
        const newOffer = await offer.save();
        const owner = await User.findOne({ email });
        // const companyProfile = await CompanyProfile.findOne({owner: userId});
        // companyProfile.companyOffers.push(newOffer._id);
        // owner.numberOfOffers += 1;

        await owner.save();

        return res.status(201).send({
            message: 'Offer created',
            createdOffer: {
                title: newOffer.title,
                description: newOffer.description,
                _id: newOffer._id,
                owner: newOffer.owner,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllOffers = async (req, res, next) => {
    const { userId, page = 1, limit = 3, pensionFrom, pensionTo, jobTitle } = req.query;

    const match = {};

    if (userId) {
        match.owner = { $gte: userId };
    }
    if (pensionFrom) {
        match.pensionFrom = { $gte: pensionFrom };
    }
    if (pensionTo) {
        match.pensionTo = { $lte: pensionTo };
    }
    
    // if (jobTitle) {
    //     const regEx = new RegExp(jobTitle, "i");
    //     match.jobTitle = { $regex: regEx };
    // }

    try {

        let offerList;
        let totalCount;
        offerList = await Offer.find(match)
            .select('-__v')
            .populate('owner', '-password -__v')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        totalCount = await Offer.countDocuments(match);

        return res.status(200).send({
            offerList,
            totalCount,
        });
    } catch (err) {
        next(err);
    }
};

exports.getDetailedOffer = async (req, res, next) => {
    const { offerId } = req.params;
    try {
        const offer = await Offer.findById(offerId).select('-__v').populate('owner', '-password -__v');
        if (!offer) {
            return res.status(200).send({
                message: 'There is no such offer',
            });
        }
        return res.status(200).send({
            offer,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateOffer = async (req, res, next) => {
    const { offerId } = req.params;
    console.log("req.body", req.body);
    const { jobTitle, jobDescription, pensionFrom, pensionTo, requiredSkills } = req.body;

    try {
        const offer = await Offer.findById(offerId);
        offer.jobTitle = jobTitle;
        offer.jobDescription = jobDescription;
        offer.pensionFrom = pensionFrom;
        offer.pensionTo = pensionTo;
        offer.requiredSkills = requiredSkills;

        await offer.save();

        return res.status(200).send({
            message: 'Offer updated',
            offer,
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteOffer = async (req, res, next) => {
    const { offerId } = req.params;

    try {
        await Offer.findByIdAndDelete(offerId);

        return res.status(200).send({
            message: 'Offer has been deleted',
        });
    } catch (err) {
        next(err);
    }
};
