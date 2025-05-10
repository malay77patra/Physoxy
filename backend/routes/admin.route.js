const { Router } = require("express");
const { deletePackage, addPackage, updatePackage, getAllSubscribers, addNewBlog, deleteBlog, addNewEvent, deleteEvent, addNewCourse, deleteCourse, getStats } = require("@/controllers/admin.controller");
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
router.route("/event/new").post(verifyAccessToken, verifyAdmin, addNewEvent);
router.route("/event/delete/:id").delete(verifyAccessToken, verifyAdmin, deleteEvent);
router.route("/course/new").post(verifyAccessToken, verifyAdmin, addNewCourse);
router.route("/course/delete/:id").delete(verifyAccessToken, verifyAdmin, deleteCourse);
router.route("/stats").get(verifyAccessToken, verifyAdmin, getStats);


module.exports = router;