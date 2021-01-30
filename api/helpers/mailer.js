const _ = require("lodash")
const nodemailer = require("nodemailer");

const config = {
    service: "gmail",

    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
}

const transporter = nodemailer.createTransport(config);

const defaultMail = {
    from: `Me <maciej.zajac.197@gmail.com>`,
    text: "test test"
};

module.exports = function(mail) {
    mail = _.merge({}, defaultMail, mail);

    transporter.sendMail(mail, function(error, info) {
        if(error) return console.log("error", error);
        console.log("mail sent:", info.response);
    });
};

