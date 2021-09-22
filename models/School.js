const { model, Schema } = require("mongoose");

const schoolSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  users: [
    {
      firstName: String,
      lastName: String,
      username: String,
      email: String,
    }
  ]
});

module.exports = model("User", userSchema);
