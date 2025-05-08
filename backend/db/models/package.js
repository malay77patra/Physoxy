const mongoose = require("mongoose");
const { Schema } = mongoose;

const packageSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        match: /^[A-Za-z]+$/
    },
    description: {
        type: String,
        require: true,
    },
    pricing: {
        monthly: {
            type: Number,
            required: true
        },
        yearly: {
            type: Number,
            required: true
        }
    }
});

module.exports = mongoose.model("Package", packageSchema);
