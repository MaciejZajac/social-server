const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if(!token) {
            res.status(401).send({
                message: "Unauthorized",
            });

        }

        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    
        req.userData = decodedToken;
        next();

    } catch (err) {
        res.status(401).send({
            message: "Unauthorized",
            error: err
        })
    }

}