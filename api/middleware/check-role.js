
function checkRoles(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        const {userRole} = req.userData;

        if(!roles.includes(userRole)) {
            return res.status(401).send({message: "Unauthorized"})
        }

        next();
    }
}

module.exports = checkRoles;