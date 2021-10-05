const usersResolvers = require("./users.js");
const schoolResolvers = require("./schools.js");

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...schoolResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...schoolResolvers.Mutation,
  },
};
