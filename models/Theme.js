const { model, Schema } = require('mongoose');

const themeSchema = new Schema ({
    title: String,
    picture: String,
    description: String,
    activity: String,
    linkToForm: String,
    createdAt: String
});

module.exports = model('Theme', themeSchema)