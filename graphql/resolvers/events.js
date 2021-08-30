const { UserInputError } = require('apollo-server')
const { createSourceEventStream } = require('graphql')

const Event = require('../../models/Event.js')
const User = require('../../models/User.js')
//const Request = require('')

const { validateCreateEventInput, validateManualInputInput } = require("../../util/validators")

// const categoryOptions = require('../../json/category.json');
// const monthOptions = require("../../json/month.json");
// var { events } = require("react-mapbox-gl/lib/map-events");

module.exports = {
    Query: {
        async getEvents(){
            try {
                const events = await Event.find().sort({createdAt: 1});
                return events;
            } catch(err){
                throw new Error(err)
            }
        }
    },

    Mutation: {
        async createEvent(_, {createEventInput: {name, code, points, expiration, createdAt}}){
            const { valid, errors } = validateCreateEventInput(name, code, points, expiration, createdAt);

            if(!valid){throw new UserInputError("User Input Error", {errors});}

            


        }
    }
}