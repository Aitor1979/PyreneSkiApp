const { validate, errors: { ContentError, ConflictError, NotFoundError} } = require('pyrene-ski-util')
const { ObjectId, models: { User, Lesson  } } = require('pyrene-ski-data')

/**
 * Retrieve lessons
 * 
 * @param {string} id 
 * 
 * @throws {NotFoundError} validate user with param id to exist
 * @throws {ContentError} validate param value id is a valid id
 * 
 * @return {Array} lessons
 */

module.exports = function(id){
    validate.string(id)
    validate.string.notVoid('id', id)
    if(!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return ( async () => {
        const user = await User.findById(id)

        if(!user) throw new NotFoundError(`user with id ${id} not found`)

        await Lesson.updateMany( { user: id } )

        const lessons = await Lesson.find({ user: id }, { __v: 0 }).populate("teamId").lean()

        lessons.forEach(lesson => {
            lesson.id = lesson._id.toString()
            delete lesson._id
            lesson.user = id
            lesson.activityName = lesson.teamId.teamActivity
            lesson.teamName = lesson.teamId.teamName
        })

        return lessons

    }) ()
}