const { gql } = require("apollo-server");

module.exports = gql`
  ### MAIN MODEL TYPES ###

  type User {
    id: ID!
    token: String!
    firstName: String!
    lastName: String!
    username: String!
    password: String!
    email: String!
    createdAt: String!
  }

  ### QUERY AND MUTATION INPUTS ###

  input RegisterInput {
    firstName: String!
    lastName: String!
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  ### QUERIES LIST ###

  type Query {
    getUsers: [User]
    getUser(userId: ID!): User
  }

  ### MUTATIONS LIST ###

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    deleteUser(userId: ID!): String!
  }
`;
