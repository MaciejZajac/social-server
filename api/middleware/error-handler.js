const CustomError = require('../error/custom-error')

const errorHandler = (err, req, res, next) => {
    console.error("error: ", err);
    if (err instanceof CustomError) {
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
