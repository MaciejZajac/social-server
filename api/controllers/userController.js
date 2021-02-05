const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const User = require('../models/userModel');
const roleEnum = require('../helpers/roleEnum');
const Developer = require('../models/userDeveloperModel');
const mailer = require('../helpers/mailer');
const BadRequestError = require('../error/bad-request-error');



exports.getDevelopers = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;

        const userList = await Developer.find().select('_id email name').limit(limit*1).skip((page - 1) * limit);
        const totalCount = await Developer.countDocuments();
        return res.status(200).send({
            userList,
            totalCount
        });
    } catch (err) {
        next(err);
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const userList = await User.find().select("-__v -updatedAt -activeExpires -password -activeToken").limit(limit*1).skip((page - 1) * limit);
        const totalCount = await User.countDocuments();
        return res.status(200).send({
            userList,
            totalCount
        });
    } catch (err) {
        next(err);
    }
};

exports.registerDeveloper = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Invalid credentials.");
    }

    try {
        let user = await Developer.findOne({ email });

        if (user) {
            throw new BadRequestError("There is already a user registered with that email.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Developer({
            email,
            password: hashedPassword,
            userRole: roleEnum.developer,
        });

        await newUser.save();

        return res.status(201).send({
            message: 'User created',
            user: newUser,
        });
    } catch (err) {
        next(err);
    }
};


exports.registerUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Invalid credentials.");
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            throw new BadRequestError("There is already a user registered with that email.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            userRole: roleEnum.company,
        });

        const cryptHash = crypto.randomBytes(20);
        
        newUser.activeToken = newUser._id + cryptHash.toString("hex");
        newUser.activeExpires = Date.now() + 24 * 3600 * 1000; // 24 godziny

        const link = "http://localhost:3000/activateaccount/" + newUser.activeToken;

        mailer({
            to: req.body.email,
            subject: "Activation email",
            html: `Activate account by clicking <a href="${link}">${link}</a>`
        })


        await newUser.save();

        return res.status(201).send({
            message: 'User created, activation email has been send',
            user: newUser,
        });
    } catch (err) {
        next(err);
    }
};

exports.activateUser = async (req, res) => {
    const {activeToken} = req.params;

    try {
        const user = await User.findOne({activeToken});
        if(!user) {
            throw new BadRequestError("There is no such User in a database");
        }
        
        if(user.activeExpires < Date.now()){
            await user.remove();
            throw new BadRequestError("Authorization token has expired. You must create a new account.");
        }

        user.active = true;

        const savedUser = await user.save();

        return res.status(200).send({
            message: "User activated",
            user: savedUser._doc
        })



    } catch (err) {
        next(err);
    }
}

exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const reqBody = req.body;
    

    try {
        const profile = await User.findByIdAndUpdate(userId, {...reqBody});

        return res.status(201).send({
            message: 'User has been updated',
            user: profile,
        });
    } catch (err) {
        next(err);
    }
};


exports.updateDeveloper = async (req, res) => {
    // const { userId } = req.params;

    // const updateOps = {};

    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }

    // try {
    //     const profile = await updateDeveloper.findByIdAndUpdate(userId, { $set: updateOps });

    //     return res.status(201).send({
    //         message: 'User has been updated',
    //         user: profile,
    //     });
    // } catch (err) {
        return res.status(500).send({
            error: err,
        });
    // }
};

exports.currentUser = async (req, res) => {
    const {userId} = req.userData;
    try {
        const user = await User.findById(userId).select("-__v -updatedAt -activeExpires -password -activeToken");

        return res.status(200).send({
            user
        })

    } catch (err) {
        next(err)
    }
}

exports.loginUser = async (req, res, next) => {
    const { email, password, roleName } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Invalid credentials.");
    }

    try {
        let user;
        if (roleName === 'COMPANY') {
            user = await User.findOne({ email });
        } else if (roleName === 'DEVELOPER') {
            user = await Developer.findOne({ email });
        }
        if (!user) {
            throw new BadRequestError("Invalid credentials");
        }

        if(!user.active) {
            throw new BadRequestError("User is not verified. Check your email with activation link.");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new BadRequestError("Invalid credentials");
        }
        const tokenData = {
            email: user.email,
            userId: user._id,
            userRole: user.userRole,
        };
        const token = jwt.sign(tokenData, process.env.JWT_KEY, {
            expiresIn: '1h',
        });
        
        return res.status(200).send({
            message: 'Auth successful',
            token,
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteDeveloper = async (req, res) => {
    try {
        await Developer.findByIdAndDelete(req.params.orderId);

        return res.status(200).json({
            message: 'User deleted',
        });
    } catch (err) {
        next(err);
    }
};


exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.orderId);

        res.status(200).json({
            message: 'User deleted',
        });
    } catch (err) {
        next(err);
    }
};
