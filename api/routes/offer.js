const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const offerController = require("../controllers/offerController");
const checkRoles = require("../middleware/check-role");
const roleEnum = require("../helpers/roleEnum");

router.post("/", checkAuth, checkRoles([roleEnum.company]), offerController.createOffer)
router.get("/", offerController.getAllOffers)
router.get("/:offerId", offerController.getDetailedOffer)
router.put("/:offerId", checkAuth, checkRoles([roleEnum.company]), offerController.updateOffer)
router.delete("/:offerId", checkAuth, checkRoles([roleEnum.company]), offerController.deleteOffer)

module.exports = router;
