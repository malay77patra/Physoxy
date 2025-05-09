const { Router } = require("express");
const { refreshAccessToken, getAllPackages, updragePackage, getMyPackage } = require("@/controllers/user.controller");
const { verifyAccessToken } = require("@/middlewares/auth.middleware");

const router = Router();

// ---------------------- Public Routes ----------------------

router.post("/refresh", refreshAccessToken);
router.get("/package/all", getAllPackages);

// ---------------------- Protected Routes ----------------------
router.post("/package/upgrade/:id", verifyAccessToken, updragePackage);
router.get("/package/my", verifyAccessToken, getMyPackage);

module.exports = router;