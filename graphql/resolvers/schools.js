const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const School = require("../../models/School.js");
const User = require("../../models/User.js");

require("dotenv").config();

const {
  validateEmailInput
} = require("../../util/validators.js");


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
    async editSchool(_, { currentEmail, schoolId, name }) {
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

      // must be an admin to edit a school
      if (!loggedInUser.permission.includes("admin")) {
        valid = false;
        throw new UserInputError("Must be an admin to edit a school.", {
          errors: {
            permission: "Must be an admin to edit a school."
          }
        });
      }

      const school = await School.findOne({ schoolId });

      if (!school) {
        throw new UserInputError("School not found.", {
          errors: {
            name: "School not found."
          }
        });
      }

      const updatedSchool = await User.findOneAndUpdate(
        { schoolId },
        { name },
        { new: true}
      );

      return updatedSchool;
  },
    async addStudent(_, { currentEmail, email, name }) {
      let { errors, valid } = validateEmailInput(email);

      if (!valid) {
        throw new UserInputError("Errors.", {
          errors
        });
      }

      const loggedInUser = await User.findOne({
        email: currentEmail
      });

      if (!loggedInUser) {
        errors.general = "User not found";
        throw new UserInputError("User not found", {
          errors
        });
      }
      
      // must be an admin to add user to school
      if (!loggedInUser.permission.includes("admin") && email != currentEmail) {
        valid = false;
        errors.general = "Must be an admin to add user to school.";
        throw new UserInputError("Must be an admin to add user to school.", {
          errors
        });
      }

      // user must exist
      const user = await User.findOne({
        email: email
      });

      if (!user) {
        throw new UserInputError("User to be added to school not found.", {
          errors: {
            email: "User to be added to school not found."
          }
        });
      }

      // school must exist
      const school = await School.findOne({ name });

      if (!school) {
        throw new UserInputError("School not found.", {
          errors: {
            name: "School not found."
          }
        });
      }

      // user must not already be in school
      const userInSchool = await School.findOne(
        { name }, 
        {"users": { 
          "firstName": user.firstName, 
          "lastName": user.lastName,
          "username": user.username,
          "email": user.email,                            
        }
      });

      if (userInSchool.users.length > 0) {
        errors.general = "User already is in school.";
        throw new UserInputError("User already is in school.", {
          errors
        });
      }

      const updatedSchool = await School.findOneAndUpdate( 
        {name},
        {
          $push: {
            users: {
              $each: [
                {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  username: user.username,
                  email: user.email,                            
                }
              ],
              $sort: { createdAt: 1 }
            }
          }
        }
      );

      return updatedSchool;
    },
    async removeStudent(_, { currentEmail, email, name }) {
      let { errors, valid } = validateEmailInput(email);

      if (!valid) {
        throw new UserInputError("Errors.", {
          errors
        });
      }

      const loggedInUser = await User.findOne({
        email: currentEmail
      });

      if (!loggedInUser) {
        errors.general = "User not found";
        throw new UserInputError("User not found", {
          errors
        });
      }
      
      // must be an admin to add user to school
      if (!loggedInUser.permission.includes("admin") && email != currentEmail) {
        valid = false;
        errors.general = "Must be an admin to remove a user to school.";
        throw new UserInputError("Must be an admin to remove a user to school.", {
          errors
        });
      }

      // user must exist
      const user = await User.findOne({
        email: email
      });

      if (!user) {
        throw new UserInputError("User to be removed from school not found.", {
          errors: {
            email: "User to be removed from school not found."
          }
        });
      }

      // school must exist
      const school = await School.findOne({ name });

      if (!school) {
        throw new UserInputError("School not found", {
          errors: {
            name: "School not found"
          }
        });
      }

      const updatedSchool = await School.findOneAndUpdate( 
        {name},
        {
          $pull: {
            users: {
              "firstName": user.firstName,
              "lastName": user.lastName,
              "username": user.username,
              "email": user.email,    
            }                        
          }
        }
      );

      return updatedSchool;
    }
  }
};
