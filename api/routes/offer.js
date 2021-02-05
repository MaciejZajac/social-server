const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const offerController = require("../controllers/offerController");
const checkRoles = require("../middleware/check-role");
const roleEnum = require("../helpers/roleEnum");

router.post("/api/offer/", checkAuth, checkRoles([roleEnum.company]), offerController.createOffer)
router.get("/api/offer/", offerController.getAllOffers)
router.get("/api/offer/:offerId", offerController.getDetailedOffer)
router.put("/api/offer/:offerId", checkAuth, checkRoles([roleEnum.company]), offerController.updateOffer)
router.delete("/api/offer/:offerId", checkAuth, checkRoles([roleEnum.company]), offerController.deleteOffer)

module.exports = router;
 