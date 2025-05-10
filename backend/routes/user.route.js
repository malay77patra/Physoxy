const { Router } = require("express");
const { refreshAccessToken, getAllPackages, updragePackage, getMyPackage, cancelPackage, getAllBlogs, getBlog, getAllEvents, getEvent, getAllCourses, getCourse } = require("@/controllers/user.controller");
const { verifyAccessToken } = require("@/middlewares/auth.middleware");

const router = Router();

// ---------------------- Public Routes ----------------------

router.post("/refresh", refreshAccessToken);
router.get("/package/all", getAllPackages);
router.get("/blog/all", getAllBlogs);
router.get("/event/all", getAllEvents);
router.get("/course/all", getAllCourses);

// ---------------------- Protected Routes ----------------------
router.get("/blog/:id", verifyAccessToken, getBlog);
router.get("/event/:id", verifyAccessToken, getEvent);
router.get("/course/:id", verifyAccessToken, getCourse);

router.post("/package/upgrade/:id", verifyAccessToken, updragePackage);
router.get("/package/my", verifyAccessToken, getMyPackage);
router.delete("/package/cancel", verifyAccessToken, cancelPackage);

module.exports = router;