const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const companyProfileController = require("../controllers/companyProfileController");
const checkRoles = require("../middleware/check-role");
const roleEnum = require("../helpers/roleEnum");

router.get("/", companyProfileController.getCompanyProfiles);
router.get("/:profileId", companyProfileController.getDetailedCompanyProfile);
router.post("/", checkAuth, checkRoles([roleEnum.company]), companyProfileController.createCompanyProfile);
router.put("/:profileId", checkAuth, checkRoles([roleEnum.company]), companyProfileController.updateCompanyProfile);
router.delete("/:profileId", checkAuth, checkRoles([roleEnum.company]), companyProfileController.deleteCompanyProfile)

module.exports = router;
 