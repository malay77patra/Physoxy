const { Router } = require("express");

const router = Router();

const authRoutes = require("@/routes/auth.route");
const userRoutes = require("@/routes/user.route");

router.use("/api", authRoutes);
router.use("/api", userRoutes);


module.exports = router;