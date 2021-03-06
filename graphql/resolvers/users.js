const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const User = require("../../models/User.js");

require("dotenv").config();

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators.js");

function generateToken(user, time) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.SECRET,
    {
      expiresIn: time,
    }
  );
}

module.exports = {
  Query: {
    async getUsers() {
      try {
        const users = await User.find().sort({
          lastName: 1,
          firstName: 1,
        });
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUser(_, { userId }) {
      try {
        const user = await User.findById(userId);
        if (user) {
          return user;
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async login(_, { username, password, remember }) {
      username = username.toLowerCase();

      const { valid, errors } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      let time = remember === "true" || remember === true ? "30d" : "24h";
      const token = generateToken(user, time);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      {
        registerInput: {
          firstName,
          lastName,
          username,
          email,
          password,
          confirmPassword,
        },
      }
    ) {
      firstName = firstName.trim();
      lastName = lastName.trim();
      email = email.toLowerCase();
      username = username.toLowerCase();

      /*validate user data*/
      const { valid, errors } = validateRegisterInput(
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      /*check that user/email doesn't already exist*/
      const isUsernameDuplicate = await User.findOne({
        username,
      });

      if (isUsernameDuplicate) {
        throw new UserInputError(
          "An account with that username already exists.",
          {
            errors: {
              username: "An account with that username already exists.",
            },
          }
        );
      }

      const isEmailDuplicate = await User.findOne({
        email,
      });

      if (isEmailDuplicate) {
        throw new UserInputError(
          "An account with that e-mail already exists.",
          {
            errors: {
              email: "An account with that email already exists.",
            },
          }
        );
      }

      /*hash password and create auth token*/
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        firstName,
        lastName,
        username,
        password,
        email,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      let time = "24h";
      const token = generateToken(user, time);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
    async deleteUser(_, { userId }) {
      try {
        const user = await User.findById(userId);
        await user.delete();
        return "User deleted successfully";
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
