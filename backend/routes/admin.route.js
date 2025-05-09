const { Router } = require("express");
const { deletePackage, addPackage, updatePackage, getAllSubscribers } = require("@/controllers/admin.controller");
const { verifyAccessToken, verifyAdmin } = require("@/middlewares/auth.middleware");

const router = Router();

// ---------------------- Public Routes ----------------------

// ---------------------- Protected Routes ----------------------
router.route("/package/new").post(verifyAccessToken, verifyAdmin, addPackage);
router.route("/package/delete/:id").delete(verifyAccessToken, verifyAdmin, deletePackage);
router.route("/package/update/:id").put(verifyAccessToken, verifyAdmin, updatePackage);
router.route("/package/subscribers").get(verifyAccessToken, verifyAdmin, getAllSubscribers);


module.exports = router;