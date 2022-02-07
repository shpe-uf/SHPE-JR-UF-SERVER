const { gql } = require("apollo-server");

module.exports = gql`
  ### MAIN MODEL TYPES ###

  type User {
    id: ID!
    token: String!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    password: String!
    createdAt: String!
    permission: String!
    school: School!
  }

  type School {
    id: ID!
    name: String!
    users: [User]!
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
    getSchools: [School]
    getSchool(schoolId: ID!): School
  }

  ### MUTATIONS LIST ###

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    deleteUser(email: String!, currentEmail: String!): [User!]!
    changePermission(
      email: String!
      currentEmail: String!
      permission: String!
    ): User!
    createSchool(name: String!): School!
    addStudent(schoolId: String!, username: String!): School!
  }
`;
