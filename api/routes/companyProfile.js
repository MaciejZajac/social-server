const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const companyProfileController = require("../controllers/companyProfileController");
const checkRoles = require("../middleware/check-role");
const roleEnum = require("../helpers/roleEnum");

router.get("/api/companyProfile/", companyProfileController.getCompanyProfiles);
router.get("/api/companyProfile/:profileId", companyProfileController.getDetailedCompanyProfile);
router.post("/api/companyProfile/", checkAuth, checkRoles([roleEnum.company]), companyProfileController.createCompanyProfile);
router.put("/api/companyProfile/:profileId", checkAuth, checkRoles([roleEnum.company]), companyProfileController.updateCompanyProfile);
router.delete("/api/companyProfile/:profileId", checkAuth, checkRoles([roleEnum.company]), companyProfileController.deleteCompanyProfile)

module.exports = router;
 