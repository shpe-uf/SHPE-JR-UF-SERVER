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
  }
  
  type Theme {
    id: ID!
    title: String!
    picture: String!
    description: String!
    activity: String!
    linkToForm: String!    
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

  input ThemeInput {
    title: String!
    picture: String!
    description: String!
    activity: String!
    linkToForm: String!        
  }

  ### QUERIES LIST ###

  type Query {
    getUsers: [User]
    getUser(userId: ID!): User
    getThemes: [Theme]
  }

  ### MUTATIONS LIST ###

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    deleteUser(userId: ID!): String!
    createTheme(themeInput: ThemeInput): Theme!
    deleteTheme(themeId: ID!): String!
    changePermission(
      email: String!
      currentEmail: String!
      permission: String!
    ): User!
  }
`;
