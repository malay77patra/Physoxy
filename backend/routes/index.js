const { Router } = require("express");

const router = Router();

const authRoutes = require("@/routes/auth.route");
const userRoutes = require("@/routes/user.route");
const adminRoutes = require("@/routes/admin.route");

router.use("/api", authRoutes);
router.use("/api", userRoutes);
router.use("/api", adminRoutes);


module.exports = router;