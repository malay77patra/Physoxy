const mongoose = require("mongoose");
const { Schema } = mongoose;

const pendingSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    attempts: {
        type: Number,
        required: true,
        default: 1,
    },
    attemptAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model("Pending", pendingSchema);