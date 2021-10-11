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

  type Event {
    id: ID!
    name: String!
    date: String!
    expiration: String!
    points: Int!
    code: String!
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

  input CreateEventInput {
    name: String!
    code: String!
    points: String!
    expiration: String!
  }

  input EditEventInput{
    name: String!
    code: String
    points: String
    expiration: String
  }



  ### QUERIES LIST ###

  type Query {
    getUsers: [User]
    getUser(userId: ID!): User
    getEvents: [Event]
    getEvent(eventId: ID!): Event
  }

  ### MUTATIONS LIST ###

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    deleteUser(userId: ID!): String!
    createEvent(createEventInput: CreateEventInput): [Event]
    deleteEvent(eventName: String!): [Event]
    editEvent(editEventInput: EditEventInput): Event
  }
`;
