const { Router } = require("express");
const { refreshAccessToken, getAllPackages, updragePackage, getMyPackage, cancelPackage, getAllBlogs } = require("@/controllers/user.controller");
const { verifyAccessToken } = require("@/middlewares/auth.middleware");

const router = Router();

// ---------------------- Public Routes ----------------------

router.post("/refresh", refreshAccessToken);
router.get("/package/all", getAllPackages);
router.get("/blog/all", getAllBlogs);

// ---------------------- Protected Routes ----------------------
router.post("/package/upgrade/:id", verifyAccessToken, updragePackage);
router.get("/package/my", verifyAccessToken, getMyPackage);
router.delete("/package/cancel", verifyAccessToken, cancelPackage);

module.exports = router;