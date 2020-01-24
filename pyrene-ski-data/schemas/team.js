const { Schema, ObjectId } = require('mongoose')
const { validators: { isEmail } } = require('pyrene-ski-util')

module.exports = new Schema({
    user: {
        type: ObjectId,
        required: true,
        ref: 'User'
    }, 
    teamName: {
        type: String,
        required: true
    },
    teamEmail: {
        type: String,
        required: true,
        validate: isEmail
    },
    teamPhone: {
        type: String,
        required: true
    },
    teamActivity: {
        type: String,
        required: true
    }
})