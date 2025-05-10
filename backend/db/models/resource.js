const mongoose = require("mongoose");
const { Schema } = mongoose;

const resourceSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["blog", "course", "event"],
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: "Package",
    }
});

module.exports = mongoose.model("Resource", resourceSchema);