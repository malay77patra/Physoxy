require("dotenv").config();
const User = require("@/db/models/user");
const Pending = require("@/db/models/pending");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("@/utils/smtp");
const { loginSchema, registerSchema } = require("@/utils/validations");
const {
    SMALL_COOL_DOWN,
    BIG_COOL_DOWN,
    MAX_MAGIC_LINK_AGE,
    MAX_REGISTRATION_TRIES,
    REFRESH_TOKEN_OPTIONS,
} = require("@/config");
const ejs = require('ejs');
const path = require("path");
const { getRandomAvatar } = require("@/utils/helpers");


//  Register user //

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        await registerSchema.validate(
            { name, email, password },
            { abortEarly: false }
        );

        const sendMagicLink = async () => {
            const magicToken = jwt.sign(
                { name, email, password },
                process.env.MAGIC_SECRET,
                { expiresIn: MAX_MAGIC_LINK_AGE.jwt }
            );

            const magicLink = `${req.protocol}://${req.get('host')}/api/verify?token=${magicToken}`;
            const subject = "Verify Your Email.";

            const html = await ejs.renderFile(path.join(__root, "views", "emails", "verification-email.ejs"), {
                magicLink
            });

            await sendEmail(email, subject, html);
        };

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "This email is already in use.",
                details: "The provided email is already registered."
            });
        }

        const now = new Date();
        const bigCoolDown = new Date(now.getTime() - BIG_COOL_DOWN);
        const smallCoolDown = new Date(now.getTime() - SMALL_COOL_DOWN);

        const pending = await Pending.findOne({ email });

        if (pending) {
            if (pending.attempts >= MAX_REGISTRATION_TRIES) {
                if (pending.attemptAt > bigCoolDown) {
                    return res.status(429).json({
                        message: "Too many attempts. Try again later.",
                        details: "wait 30mins before trying again"
                    });
                }
                pending.attempts = 1;
            } else if (pending.attemptAt > smallCoolDown) {
                return res.status(429).json({
                    message: "Please wait before trying again.",
                    details: "wait 2 mins before trying again",
                });
            } else {
                pending.attempts += 1;
            }

            pending.attemptAt = now;
            await pending.save();
        } else {
            await Pending.create({ email, attempts: 1, attemptAt: now });
        }

        await sendMagicLink();

        return res.status(200).json({
            message: "Verification link has been sent to your email. Please check your inbox."
        });
    } catch (error) {

        // Validation error
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.errors[0] || "Input registration data is invalid.",
                details: "provided registration data is invalid"
            });
        }

        throw error;
    }
};


// Login User //

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        await loginSchema.validate({ email, password }, { abortEarly: false });

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found. Please register first.",
                details: "no user registered with this email",
            });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(403).json({
                message: "Incorrect password.",
                details: "entered password is incorrect",
            });
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        await User.findOneAndUpdate(
            { email: user.email },
            { refreshToken },
            { new: true }
        );

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, REFRESH_TOKEN_OPTIONS)
            .json({
                message: "Logged in.",
                user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role },
                accessToken,
            });
    } catch (error) {

        // Validation error
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.errors[0] || "Input login data is invalid.",
                details: "provided login data is invalid"
            });
        }

        throw error;
    }
};


// Logout user //

const logoutUser = async (req, res) => {

    await User.findOneAndUpdate(
        { email: req.user.email },
        { $unset: { refreshToken: 1 } },
        { new: true }
    );

    const REFRESH_TOKEN_OPTIONS_FOR_DELETION = { ...REFRESH_TOKEN_OPTIONS };
    // Remove the maxAge property since its depreacted from clearCookie.
    //
    // express deprecated res.clearCookie: Passing "options.maxAge" is deprecated.
    // In v5.0.0 of Express, this option will be ignored, as res.clearCookie will automatically set cookies to expire immediately.
    //
    delete REFRESH_TOKEN_OPTIONS_FOR_DELETION.maxAge;

    res.clearCookie("refreshToken", REFRESH_TOKEN_OPTIONS_FOR_DELETION);

    return res.status(200).json({
        message: "Logged out.",
    });
};

// Verify Magic Link

const verifyMagicLink = async (req, res) => {
    try {
        const { token } = req.query

        if (!token) {
            return res.status(400).render(path.join("pages", "verify-email"), {
                error: "Invalid or missing token."
            })
        }

        const decodedToken = jwt.verify(token, process.env.MAGIC_SECRET)
        const { name, email, password } = decodedToken
        const avatar = getRandomAvatar()

        const pending = await Pending.findOne({ email })

        if (!pending) {
            const existingUser = await User.findOne({ email })

            if (existingUser) {
                return res.render(path.join("pages", "verify-email"), {
                    success: true
                })
            } else {
                return res.status(404).render(path.join("pages", "verify-email"), {
                    error: "User not found for this token."
                })
            }
        }

        await User.create({ name, email, password, avatar })
        await Pending.deleteOne({ email })

        return res.render(path.join("pages", "verify-email"), {
            error: ""
        })

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).render(path.join("pages", "verify-email"), {
                error: "This link has expired. Please request a new one."
            })
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).render(path.join("pages", "verify-email"), {
                error: "Invalid verification link."
            })
        } else if (error.name === "NotBeforeError") {
            return res.status(401).render(path.join("pages", "verify-email"), {
                error: "This link is not active yet. Try again later."
            })
        }

        throw error;
    }
}

module.exports = { registerUser, loginUser, logoutUser, verifyMagicLink };
