const CustomError = require('./custom-error')

class NotFoundError extends CustomError {
    statusCode = 404;
    reason = "Route not found";
    constructor() {
        super("Route not found");

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return [
            {
                message: "Route not found"
            }
        ]
    }

}

module.exports = NotFoundError;