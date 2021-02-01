const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const roleEnum = require('../helpers/roleEnum');
const checkAuth = require("../middleware/check-auth");
const checkRoles = require("../middleware/check-role");


router.post("/login", userController.loginUser)




/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve a list of all users
 *     description: Get a list of all users from a database
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount: 
 *                   type: number
 *                 userList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         description: The user's email.
 *                         example: "test@test.com"
 *                       _id:
 *                         type: string
 *                         description: The user's id.
 *                         example: "123451asdg"
 */
router.get("/", userController.getUsers)
router.get("/current", checkAuth, userController.currentUser)
router.post("/register", userController.registerUser)
router.get("/active/:activeToken", userController.activateUser)
router.put("/:userId", checkAuth, checkRoles([roleEnum.company]), userController.updateUser)
router.delete("/:userId", checkAuth, checkRoles([roleEnum.company]), userController.deleteUser)


// developer user
router.get("/developers", userController.getDevelopers)
router.post("/registerDeveloper", userController.registerDeveloper)
router.patch("/developer/:userId", checkAuth, checkRoles([roleEnum.developer]), userController.updateDeveloper)
router.delete("/developer/:userId", checkAuth, checkRoles([roleEnum.developer]), userController.deleteDeveloper)

module.exports = router;
