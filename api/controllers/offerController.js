const Offer = require("../models/offerModel");


exports.createOffer = async (req, res) => {

    const { title, description} = req.body;
    const { userId } = req.userData;

    if(!title || !description) {
        res.status(406).send({
            message: "Some fields are missing"
        })
    }

    const offer = new Offer({
        title,
        description,
        owner: userId
    })

    try {
        const newOffer = await offer.save();
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
            offerList = await Offer.find().select("_id title description owner").populate("owner", "_id email").limit(limit*1).skip((page - 1) * limit);
        } else {
            offerList = await Offer.find({owner: userId}).select("_id title description owner").populate("owner", "_id email").limit(limit*1).skip((page - 1) * limit);
        }
        totalCount = await Offer.countDocuments();

        return res.status(200).send({
            offerList,
            totalCount
        });

    } catch (err) {
        return res.status(500).send({
            error: err,
        });

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
        return res.status(500).send({
            error: err,
        });
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

        res.status(200).send({
            message: "Offer updated",
            offer
        })
    } catch (err) {
        return res.status(500).send({
            error: err,
        });
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
        return res.status(500).send({
            error: err,
        });
    }
}