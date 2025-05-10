require("dotenv").config();
const User = require("@/db/models/user");
const Package = require("@/db/models/package");
const Resource = require("@/db/models/resource");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { upgradePlanSchema } = require("@/utils/validations");

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

const updragePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const now = Date.now();
        const validatedData = await upgradePlanSchema.validate(req.body);

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid package ID",
                details: "package id is not a valid object id",
            });
        }

        const package = await Package.findById(id);
        if (!package) {
            return res.status(404).json({
                message: "Package not found",
                details: "no package found with the given id",
            });
        }

        if (package._id.equals(req.user.subscription.id) && (req.user.subscription.endsAt > now) && (validatedData.type === req.user.subscription.type)) {
            return res.status(403).json({
                message: "Already subscribed to this plan!",
                details: "user is already subscribed to this plan",
            });
        }

        let moneyLeft = 0;
        if (req.user.subscription && req.user.subscription.endsAt > now && req.user.subscription.type === "yearly") {
            const pricePerMonth = req.user.subscription.amount / 12;
            const monthsLeft = Math.floor(
                (req.user.subscription.endsAt - now) / (1000 * 60 * 60 * 24 * 30)
            );
            moneyLeft = pricePerMonth * monthsLeft;
        }

        const packagePrice = validatedData.type === "yearly" ? package.pricing.yearly : package.pricing.monthly;
        const moneyToBePaid = packagePrice - moneyLeft;
        const user = await User.findById(req.user._id);

        if (moneyToBePaid >= 0) {
            // charge money from card, (mock wait)
            await new Promise((resolve) => setTimeout(resolve, 2000));
            user.subscription = {
                id: package._id,
                type: validatedData.type,
                amount: packagePrice,
                startsAt: now,
                endsAt: validatedData.type === "yearly" ? now + 12 * 30 * 24 * 60 * 60 * 1000 : now + 30 * 24 * 60 * 60 * 1000,
            };
            const updatedUser = await user.save();

            return res.status(200).json(updatedUser.subscription);
        }

        // refund money
        await new Promise((resolve) => setTimeout(resolve, 2000));
        user.subscription = {
            id: package._id,
            type: validatedData.type,
            amount: packagePrice,
            startsAt: now,
            endsAt: validatedData.type === "yearly" ? now + 12 * 30 * 24 * 60 * 60 * 1000 : now + 30 * 24 * 60 * 60 * 1000,
        };
        const updatedUser = await user.save();

        return res.status(200).json(updatedUser.subscription);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.errors[0] || "Invalid package data.",
                details: "provided package data is invalid"
            });
        }

        throw error;
    }

}

const cancelPackage = async (req, res) => {
    const user = await User.findById(req.user._id);
    user.subscription = null;
    await user.save()

    // Logic to refund user's unused money

    return res.status(200).json({})
}

const getMyPackage = async (req, res) => {
    const now = new Date();

    if (req.user.subscription.endsAt > now) {
        return res.status(200).json(req.user.subscription);
    }
    return res.status(200).json({});
};

const getAllBlogs = async (req, res) => {
    const blogs = await Resource.find({ type: "blog" })
    .select("-content -type")
    .populate('plan', 'name');

    return res.status(200).json(blogs);
}

module.exports = { refreshAccessToken, getAllPackages, updragePackage, getMyPackage, cancelPackage, getAllBlogs };
