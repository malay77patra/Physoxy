const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { MAX_ACCESS_TOKEN_AGE, MAX_REFRESH_TOKEN_AGE } = require("@/config");

const userSchema = new Schema(
    {
        role: {
            type: String,
            default: "user"
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            require: true,
            default: 'https://api.dicebear.com/9.x/thumbs/svg?seed=default'
        },
        refreshToken: {
            type: String,
        },
        subscription: {
            id: {
                type: Schema.Types.ObjectId,
                ref: "Package",
            },
            type: {
                type: String,
                enum: ["monthly", "yearly"],
            },
            amount: {
                type: Number,
                min: 0,
            },
            startsAt: {
                type: Date,
            },
            endsAt: {
                type: Date,
            },
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: MAX_ACCESS_TOKEN_AGE.jwt,
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            email: this.email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: MAX_REFRESH_TOKEN_AGE.jwt,
        }
    );
};

module.exports = mongoose.model("User", userSchema);