const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const School = require("../../models/School.js");

require("dotenv").config();

module.exports = {
  Query: {
    async getSchools() {
      try {
        const schools = await School.find().sort({
          name: 1
        });
        return schools;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getSchool(_, { schoolId }) {
      try {
        const school = await School.findById(schoolId);
        if (school) {
          return school;
        } else {
          throw new Error("School not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createSchool(_, { name }) {
      const newSchool = new School({
        name,
        createdAt: new Date().toISOString()
      });

      await newTask.save();

      const res = School.findOne({ name });

      return res;
    },
    async addUser(_, { schoolId, username }) {
      const user = await User.findOne({
        username
      });

      if (!user) {
        errors.general = "User not found.";
        throw new UserInputError("User not found.", {
          errors
        });
      }

      var updatedSchool = await School.findOneAndUpdate(
        {
          schoolId
        },
        {
          $push: {
            users: {
              $each: [
                {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  username: user.username,
                  email: user.email
                }
              ],
              $sort: {
                lastName: 1,
                firstName: 1
              }
            }
          },
          $inc: pointsIncrease
        },
        {
          new: true
        }
      );
      return updatedSchool;
    }
  }
};
