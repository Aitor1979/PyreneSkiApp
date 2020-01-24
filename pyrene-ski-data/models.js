const { model } = require('mongoose')
const { user, team, lesson } = require('./schemas')

module.exports = {

    User: model('User', user),
    Team: model('Team', team),
    Lesson: model('Lesson', lesson)
}