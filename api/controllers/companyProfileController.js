const CompanyProfile = require("../models/companyProfileModel");


exports.createCompanyProfile = async (req, res) => {
    const { userId } = req.userData;
    const { companyName, companyDescription, technologiesUsed, socialMedia } = req.body;

    try {
        const foundOffer = await CompanyProfile.findOne({owner: userId});
        console.log("foundOffer", foundOffer);

        if(foundOffer) {
            return res.status(406).send({
                message: "Company already has a profile created"
            });
        }

        const companyProfile = new CompanyProfile({
            companyName, companyDescription, technologiesUsed, socialMedia,
            owner: userId
        })

        const profile = await companyProfile.save();

        return res.status(201).send({
            message: "Company profile has beed created",
            companyProfile: profile,
        });

    } catch (err) {
        return res.status(500).send({
            message: "Something went wrong",
            error: err,
        });
    }
}

exports.updateCompanyProfile = async (req, res) => {
    const { userId } = req.userData;
    const { companyName, companyDescription, technologiesUsed, socialMedia } = req.body;

    try {
        const foundOffer = await CompanyProfile.findOne({owner: userId});

        foundOffer.companyName = companyName;
        foundOffer.companyDescription = companyDescription;
        foundOffer.technologiesUsed = technologiesUsed;
        foundOffer.socialMedia = socialMedia;

        const profile = await foundOffer.save();

        return res.status(201).send({
            message: "Company profile has beed updated",
            companyProfile: profile,
        });

    } catch (err) {
        console.log("err", err);
        return res.status(500).send({
            message: "Something went wrong",
            error: err,
        });
    }
}

exports.getCompanyProfiles = async (req, res) => {

    try {
        const { page = 1, limit = 3 } = req.query;

        const foundProfiles = await CompanyProfile.find().select("-__v -updatedAt -socialMedia -technologiesUsed").limit(limit*1).skip((page - 1) * limit);
        const totalCount = await CompanyProfile.countDocuments();
        
        console.log("foundProfiles", foundProfiles);
        
        return res.status(200).send({
            companyProfiles: foundProfiles,
            totalCount
        })

    } catch (err) {
        return res.status(500).send({
            message: "Something went wrong",
            error: err,
        });

    }
}

exports.getDetailedCompanyProfile = async (req, res) => {
    const { profileId } = req.params;

    try {
        const foundOffer = await CompanyProfile.findById(profileId).select("-__v -updatedAt").populate("owner", "email");
        console.log("foundOffer", foundOffer);
        if(!foundOffer) {
            return res.status(404).send({
                message: "There is no such company Profile"
            });
        }

        return res.status(200).send({
            companyProfile: foundOffer
        })

    } catch (err) {
        return res.status(500).send({
            message: "Something went wrong",
            error: err,
        });

    }
};

exports.deleteCompanyProfile = async (req, res) => {
    const { profileId } = req.params;
    const { userId } = req.userData;

    try {
        await CompanyProfile.findOneAndRemove({owner: userId, _id: profileId });

        return res.status(404).send({
            message: "Offer has been deleted"
        });


    } catch (err) {
        return res.status(500).send({
            message: "Something went wrong",
            error: err,
        });

    }
}