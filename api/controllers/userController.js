const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const roleEnum = require('../helpers/roleEnum');
const Developer = require('../models/userDeveloperModel');



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
        return res.status(500).send({
            error: err,
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const userList = await User.find().select('_id email companyName companyUrl').limit(limit*1).skip((page - 1) * limit);
        const totalCount = await User.countDocuments();
        return res.status(200).send({
            userList,
            totalCount
        });
    } catch (err) {
        return res.status(500).send({
            error: err,
        });
    }
};

exports.registerDeveloper = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(409).send({
            message: 'Invalid data. Something is missing',
        });
    }

    try {
        let user = await Developer.findOne({ email });

        if (user) {
            return res.status(409).send({
                message: 'Invalid data',
            });
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
        return res.status(500).send({
            error: err,
        });
    }
};
exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("email, password", email, password);
    if (!email || !password) {
        return res.status(409).send({
            message: 'Invalid data. Something is missing',
        });
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(409).send({
                message: 'Invalid data'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            userRole: roleEnum.company,
        });

        await newUser.save();

        return res.status(201).send({
            message: 'User created',
            user: newUser,
        });
    } catch (err) {
        console.log("err", err);
        return res.status(500).send({
            error: err,
        });
    }
};

exports.updateUser = async (req, res) => {
    const { userId } = req.params;

    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    try {
        const profile = await User.findByIdAndUpdate(userId, { $set: updateOps });

        return res.status(201).send({
            message: 'User has been updated',
            user: profile,
        });
    } catch (err) {
        return res.status(500).send({
            error: err,
        });
    }
};


exports.updateDeveloper = async (req, res) => {
    const { userId } = req.params;

    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    try {
        const profile = await updateDeveloper.findByIdAndUpdate(userId, { $set: updateOps });

        return res.status(201).send({
            message: 'User has been updated',
            user: profile,
        });
    } catch (err) {
        return res.status(500).send({
            error: err,
        });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password, roleName } = req.body;

    if (!email || !password) {
        return res.status(409).send({
            message: 'Invalid data. Email or password is missing',
        });
    }

    try {
        let user;
        if (roleName === 'COMPANY') {
            user = await User.findOne({ email });
        } else if (roleName === 'DEVELOPER') {
            user = await Developer.findOne({ email });
        }

        if (!user) {
            return res.status(401).send({
                message: 'Auth failed',
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(409).send({
                message: 'Invalid data. Email or password is wrong',
            });
        }

        const tokenData = {
            email: user.email,
            userId: user._id,
            userRole: user.userRole,
        };
        const token = jwt.sign(tokenData, process.env.JWT_KEY, {
            expiresIn: '1h',
        });

        res.status(200).send({
            message: 'Auth successful',
            token,
        });
    } catch (err) {
        return res.status(500).send({
            error: err,
        });
    }
};

exports.deleteDeveloper = async (req, res) => {
    try {
        await Developer.findByIdAndDelete(req.params.orderId);

        res.status(200).json({
            message: 'User deleted',
        });
    } catch (err) {
        return res.status(500).send({
            error: err,
        });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.orderId);

        res.status(200).json({
            message: 'User deleted',
        });
    } catch (err) {
        return res.status(500).send({
            error: err,
        });
    }
};
