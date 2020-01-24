const { validate, errors: { NotFoundError, ContentError } } = require('pyrene-ski-util')
const { ObjectId, models: { User, Team, Lesson } } = require('pyrene-ski-data')

/**
 * Create and add a lesson 
 * 
 * @param {*} userId 
 * @param {*} date 
 * @param {*} timeStart 
 * @param {*} timeEnd 
 * @param {*} teamId 
 * 
 * @throws {NotFoundError}  validate user with param userId to exist
 * @throws {NotFoundError}  validate teamdata with param teamId to exist
 * 
 * @return {string} lesson id
 * 
 */

 module.exports = function(userId, date, timeStart, timeEnd, teamId) {

    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)
    
/*  validate.string(teamId)
    validate.string.notVoid('teamId', teamId)
    if (!ObjectId.isValid(teamId)) throw new ContentError(`${teamId} is not a valid id`) */

    //date = new Date(date) 
    //validate.date(date)
    //validate.string.notVoid('date', date)

    validate.string(date)
    validate.string.notVoid('date', date)
    
    validate.string(timeStart)
    validate.string.notVoid('timeStart', timeStart)

    validate.string(timeEnd)
    validate.string.notVoid('timeEnd', timeEnd)
    
    return (async() => { 

        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        const teamdata = await Team.findById(teamId)
        if (!teamdata) throw new NotFoundError(`team with id ${teamId} not found`)



        const lesson = await Lesson.create({ user: userId, date, timeStart, timeEnd, teamId })

        user.lessons.push(lesson) 
        
        await user.save()

        return lesson.id

    })()
}
