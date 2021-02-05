const CompanyProfile = require('../models/companyProfileModel');
const UserModel = require('../models/userModel');

exports.createCompanyProfile = async (req, res) => {
    const { userId } = req.userData;
    const { companyDescription, skillsInCompany } = req.body;

    try {
        const foundOffer = await CompanyProfile.findOne({ owner: userId });
        const owner = await UserModel.findById(userId);

        if (!owner) {
            return res.status(404).send({
                message: 'There is no such user',
            });
        }


        if (foundOffer) {
            return res.status(406).send({
                message: 'Company already has a profile created',
            });
        }
        
        const companyProfile = new CompanyProfile({
            skillsInCompany,
            companyDescription,
            companyOffers: [],
            owner: userId,
        });

        const profile = await companyProfile.save();
        owner.companyPublicProfile = profile._id;
        await owner.save();

        return res.status(201).send({
            message: 'Company profile has beed created',
            companyProfile: profile,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateCompanyProfile = async (req, res) => {
    const { userId } = req.userData;
    const { companyName, companyDescription, technologiesUsed, socialMedia } = req.body;

    try {
        const foundOffer = await CompanyProfile.findOne({ owner: userId });

        foundOffer.companyName = companyName;
        foundOffer.companyDescription = companyDescription;
        foundOffer.technologiesUsed = technologiesUsed;
        foundOffer.socialMedia = socialMedia;

        const profile = await foundOffer.save();

        return res.status(201).send({
            message: 'Company profile has beed updated',
            companyProfile: profile,
        });
    } catch (err) {
        next(err);
    }
};

exports.getCompanyProfiles = async (req, res) => {
    try {
        const { page = 1, limit = 3 } = req.query;

        const foundProfiles = await CompanyProfile.find()
            .select('-__v -updatedAt -socialMedia -technologiesUsed')
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const totalCount = await CompanyProfile.countDocuments();


        return res.status(200).send({
            companyProfiles: foundProfiles,
            totalCount,
        });
    } catch (err) {
        next(err);
    }
};

exports.getDetailedCompanyProfile = async (req, res) => {
    const { profileId } = req.params;

    try {
        const foundOffer = await CompanyProfile.findById(profileId)
            .select('-__v -updatedAt')
            .populate('owner', 'email');
            
        if (!foundOffer) {
            return res.status(404).send({
                message: 'There is no such company Profile',
            });
        }

        return res.status(200).send({
            companyProfile: foundOffer,
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteCompanyProfile = async (req, res) => {
    const { profileId } = req.params;
    const { userId } = req.userData;

    try {
        await CompanyProfile.findOneAndRemove({ owner: userId, _id: profileId });

        return res.status(404).send({
            message: 'Offer has been deleted',
        });

    } catch (err) {
        next(err);
    }
};
