import { CustomError } from './custom-error'

class NotAuthorizedError extends CustomError {
    statusCode = 400;
    reason = "Not Authorized";
    constructor() {
        super(this.reason);

        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors() {
        return [
            {
                message: this.reason
            }
        ]
    }

}
module.exports = NotAuthorizedError;