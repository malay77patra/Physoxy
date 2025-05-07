const { Router } = require("express");
const { refreshAccessToken } = require("@/controllers/user.controller");

const router = Router();

// ---------------------- Public Routes ----------------------

router.post("/refresh", refreshAccessToken);

// ---------------------- Protected Routes ----------------------

module.exports = router;