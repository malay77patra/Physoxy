const { Router } = require("express");
const { refreshAccessToken, getAllPackages } = require("@/controllers/user.controller");

const router = Router();

// ---------------------- Public Routes ----------------------

router.post("/refresh", refreshAccessToken);
router.get("/package/all", getAllPackages);

// ---------------------- Protected Routes ----------------------

module.exports = router;