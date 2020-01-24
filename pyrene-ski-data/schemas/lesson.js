const { Schema, ObjectId } = require('mongoose')

module.exports = new Schema({
    user: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: String,
        required: true

    },
    timeStart: {
        type: String,
        required: true

    },
    timeEnd: {
        type: String,
        required: true
    },
    teamId: {
        type: ObjectId,
        required: true,
        ref: 'Team'
        }  
    
})