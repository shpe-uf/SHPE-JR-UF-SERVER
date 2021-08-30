const { UserInputError } = require('apollo-server')
const { createSourceEventStream } = require('graphql')

const Event = require('../../models/Event.js')
const User = require('../../models/User.js')
//const Request = require('')

const { validateCreateEventInput, validateManualInputInput } = require("../../util/validators")

// const categoryOptions = require('../../json/category.json');
//const monthOptions = require("../../json/month.json");
// var { events } = require("react-mapbox-gl/lib/map-events");

module.exports = {
    Query: {
        async getEvents(){
            try {
                const events = await Event.find().sort({createdAt: 1});
                return events;
            } catch(err){
                throw new Error(err);
            }
        }
    },

    Mutation: {
        async createEvent(_, {createEventInput: {name, code, points, expiration, createdAt}}){
            const { valid, errors } = validateCreateEventInput(name, code, points, expiration, createdAt);

            if(!valid){throw new UserInputError("User Input Error", {errors});}

            code = code.toLowerCase().trim().replace(/ /g, "");

            expiration = new Date(new Date().getTime() + parseInt(expiration, 10) * 60 * 60 * 1000);

            isEventNameDuplicate = await Event.findOne({name});
            isEventCodeDuplicate = await Event.findOne({ code });

            if(isEventNameDuplicate){
                throw new UserInputError("An event with that name already exists.", {
                    errors:{
                        name: "An event with that name already exists."
                    }
                });
            }

            if (isEventCodeDuplicate) {
              throw new UserInputError("An event with that code already exists.", {
                errors: {
                  code: "An event with that code already exists."
                }
              });
            }

            const newEvent = new Event({
                name,
                code,
                points,
                expiration,
                createdAt: new Date().toISOString()
            });

            await newEvent.save()
            
            const updatedEvents = await Event.find();

            return updatedEvents;

        }
    }
}