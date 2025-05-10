const { Router } = require("express");
const { deletePackage, addPackage, updatePackage, getAllSubscribers, addNewBlog, deleteBlog } = require("@/controllers/admin.controller");
const { verifyAccessToken, verifyAdmin } = require("@/middlewares/auth.middleware");

const router = Router();

// ---------------------- Public Routes ----------------------

// ---------------------- Protected Routes ----------------------
router.route("/package/new").post(verifyAccessToken, verifyAdmin, addPackage);
router.route("/package/delete/:id").delete(verifyAccessToken, verifyAdmin, deletePackage);
router.route("/package/update/:id").put(verifyAccessToken, verifyAdmin, updatePackage);
router.route("/package/subscribers").get(verifyAccessToken, verifyAdmin, getAllSubscribers);
router.route("/blog/new").post(verifyAccessToken, verifyAdmin, addNewBlog);
router.route("/blog/delete/:id").delete(verifyAccessToken, verifyAdmin, deleteBlog);


module.exports = router;