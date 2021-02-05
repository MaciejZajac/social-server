const CustomError = require('../error/custom-error')

const errorHandler = (err, req, res, next) => {
    console.log("error@@@@", err);
    if (err instanceof CustomError) {
        console.log("err", err);
        return res.status(err.statusCode).send({
            errors: err.serializeErrors()
        })
    }


    return res.status(500).send({
        errors: [
            {
                message: "Something went wrong"
            }
        ]
    })
}

module.exports = errorHandler;
