const jwt = require("jsonwebtoken");
const User = require("@/db/models/user");

const verifyAccessToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer", "").trim();

        if (!token) {
            return res.status(401).json({
                refresh: true,
                message: "Please login first.",
                details: "no access token is provided with request headers"
            });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findOne({ email: decodedToken.email });

        if (!user) {
            return res.status(401).json({
                message: "User not found.",
                details: "no user found for the provided access token"
            });
        }

        req.user = user;
        next();

    } catch (error) {

        // Token errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                refresh: true,
                message: "Refreshing session.",
                details: "the access token has beed expired, refresh required"
            });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                refresh: true,
                message: "Refreshing session.",
                details: "invalid access token provided, refresh required"
            });
        } else if (error.name === "NotBeforeError") {
            return res.status(401).json({
                refresh: true,
                message: "Please wait.",
                details: "access token is not active yet"
            });
        }

        throw error;
    }
};

const verifyAdmin = async (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Forbidden network request.",
            details: "user is not an admin"
        });
    }

    next();
}

module.exports = {
    verifyAccessToken,
    verifyAdmin,
};
