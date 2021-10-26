const usersResolvers = require("./users.js");
const themesResolvers = require('./themes.js');

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...themesResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
  },
};
