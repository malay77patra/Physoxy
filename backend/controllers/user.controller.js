require("dotenv").config();
const User = require("@/db/models/user");
const Package = require("@/db/models/package");
const jwt = require("jsonwebtoken");

// Get packages

const getAllPackages = async (req, res) => {
    const packages = await Package.find();

    return res.status(200).json(packages);
}

// Refresh user

const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({
                redirect: true,
                message: "Please login first.",
                details: "no refresh token is found in request cookies",
            });
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const user = await User.findOne({ email: decodedToken.email });

        if (!user || user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json({
                redirect: true,
                message: "Invalid refresh token.",
                details: "user refresh token doesnt match any user",
            });
        }

        const accessToken = user.generateAccessToken();
        await User.findOneAndUpdate(
            { email: user.email },
            { accessToken },
            { new: true }
        );

        return res.status(200).json({
            accessToken,
        });
    } catch (error) {

        // Token errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                redirect: true,
                message: "Session expired, Please login.",
                details: "refresh token has been expired"
            });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                redirect: true,
                message: "Invalid credentials, Please login.",
                details: "invalid refresh token is provided"
            });
        } else if (error.name === "NotBeforeError") {
            return res.status(401).json({
                redirect: true,
                message: "The session is not active yetv Please wait.",
                details: "refresh token is not active yet."
            });
        }

        throw error;
    }
};

module.exports = { refreshAccessToken, getAllPackages };
