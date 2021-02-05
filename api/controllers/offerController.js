const Offer = require("../models/offerModel");
const User = require("../models/userModel");
const CompanyProfile = require("../models/companyProfileModel");

exports.createOffer = async (req, res) => {

    const { userId, email } = req.userData;



    const offer = new Offer({
        ...req.body,
        owner: userId
    })

    try {
        const newOffer = await offer.save();
        const owner = await User.findOne({email});
        const companyProfile = await CompanyProfile.findOne({owner: userId});
        companyProfile.companyOffers.push(newOffer._id);
        owner.numberOfOffers += 1;

        await owner.save();
        await companyProfile.save();

        return res.status(201).send({
            message: "Offer created",
            createdOffer: {
                title: newOffer.title,
                description: newOffer.description,
                _id: newOffer._id,
                owner: newOffer.owner
            }
        });
    } catch (err) {
        return res.status(500).send({
            error: err,
        });
    }
}

exports.getAllOffers = async (req, res) => {
    
    try {
        const { userId, page = 1, limit = 3 } = req.query;
        let offerList;
        let totalCount;
        if(!userId){
            offerList = await Offer.find().select("-__v").populate("owner", "_id email").limit(limit*1).skip((page - 1) * limit);
        } else {
            offerList = await Offer.find({owner: userId}).select("-__v").populate("owner", "_id email").limit(limit*1).skip((page - 1) * limit);
        }
        totalCount = await Offer.countDocuments();

        return res.status(200).send({
            offerList,
            totalCount
        });

    } catch (err) {
        next(err);
    }
}

exports.getDetailedOffer = async (req, res) => {
    const {offerId} = req.params;
    try {
        const offer = await Offer.findById(offerId).select("-__v").populate("owner");
        if(!offer) { 
            return res.status(200).send({
                message: "There is no such offer",
            });
        }
        return res.status(200).send({
            offer,
        });
        
    } catch (err) {
        next(err);
    }
}

exports.updateOffer = async (req, res) => {
    const {offerId} = req.params;
    const { title, description } = req.body;

    try {
        const offer = await Offer.findById(offerId)
        offer.title = title;
        offer.description = description;
        await offer.save();

        return res.status(200).send({
            message: "Offer updated",
            offer
        })
    } catch (err) {
        next(err);
    }
}

exports.deleteOffer = async (req, res) => {
    const {offerId} = req.params;

    try {
        await Offer.findByIdAndDelete(offerId);

        return res.status(200).send({
            message: "Offer has been deleted"
        });


    } catch (err) {
        next(err);
    }
}