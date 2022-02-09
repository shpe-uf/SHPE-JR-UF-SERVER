const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const School = require("../../models/School.js");
const User = require("../../models/User.js");

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
    async createSchool(_, { currentEmail, name }) {

      const loggedInUser = await User.findOne({
        email: currentEmail
      });

      if (!loggedInUser) {
        throw new UserInputError("User not found.", {
          errors: {
            email: "User not found."
          }
        });
      }

      // must be an admin to create a school
      if (!loggedInUser.permission.includes("admin")) {
        valid = false;
        throw new UserInputError("Must be an admin to create a school.", {
          errors: {
            permission: "Must be an admin to create a school."
          }
        });
      }

      name = name.trim();

      // check that school with that name doesn't already exist 
      const isSchoolNameDuplicate = await School.findOne({ name });

      if (isSchoolNameDuplicate) {
        throw new UserInputError(
          "A school with that name already exists.",
          {
            errors: {
              name: "A school with that name already exists.",
            },
          }
        );
      }

      const newSchool = new School({
        name,
        createdAt: new Date().toISOString()
      });

      await newSchool.save();

      const updatedSchools = await School.find();

      return updatedSchools;
    },
    async deleteSchool(_, { currentEmail, name }) {
      const loggedInUser = await User.findOne({
        email: currentEmail
      });

      if (!loggedInUser) {
        throw new UserInputError("User not found.", {
          errors: {
            email: "User not found."
          }
        });
      }

      // must be an admin to delete a school
      if (!loggedInUser.permission.includes("admin")) {
        valid = false;
        throw new UserInputError("Must be an admin to delete a school.", {
          errors: {
            permission: "Must be an admin to delete a school."
          }
        });
      }

      try {
        const school = await School.findOne({ name });

        if (!school) {
          throw new UserInputError("School to be deleted not found", {
            errors: {
              name: "School to be deleted not found"
            }
          });
        }

        await school.delete();

        let schools = await School.find();
        return schools;
      } catch (err) {
        throw new Error(err);
      }
    },
    async addStudent(_, { name, username }) {
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
        {name},
        {
          $push: {
            users: {
              $each: [
                {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  username: user.username,
                  email: user.email,                            }
              ],
              $sort: { createdAt: 1 }
            }
          }
        } );

      return updatedSchool;
    }
  }
};
