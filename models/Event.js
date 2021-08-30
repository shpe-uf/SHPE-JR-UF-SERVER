const { model, Schema } = require("mongoose")

const eventSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    points: {
        type: Number,
        required: true
    },
    expiration: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    }

});

module.exports = model("Event", eventSchema);
