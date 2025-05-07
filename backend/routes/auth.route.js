const { Router } = require("express");
const { registerUser, loginUser, logoutUser, verifyMagicLink } = require("@/controllers/auth.controller");
const { verifyAccessToken } = require("@/middlewares/auth.middleware");

const router = Router();

// ---------------------- Public Routes ----------------------

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify").get(verifyMagicLink);

// ---------------------- Protected Routes ----------------------
router.route("/logout").post(verifyAccessToken, logoutUser);



module.exports = router;