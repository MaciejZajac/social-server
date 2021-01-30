const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const roleEnum = require('../helpers/roleEnum');
const checkAuth = require("../middleware/check-auth");
const checkRoles = require("../middleware/check-role");


router.post("/login", userController.loginUser)


// company user
router.get("/", userController.getUsers)
router.post("/register", userController.registerUser)
router.get("/active/:activeToken", userController.activateUser)
router.patch("/:userId", checkAuth, checkRoles([roleEnum.company]), userController.updateUser)
router.delete("/:userId", checkAuth, checkRoles([roleEnum.company]), userController.deleteUser)


// developer user
router.get("/developers", userController.getDevelopers)
router.post("/registerDeveloper", userController.registerDeveloper)
router.patch("/developer/:userId", checkAuth, checkRoles([roleEnum.developer]), userController.updateDeveloper)
router.delete("/developer/:userId", checkAuth, checkRoles([roleEnum.developer]), userController.deleteDeveloper)

module.exports = router;
