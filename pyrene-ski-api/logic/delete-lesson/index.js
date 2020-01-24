const { validate, errors: { NotFoundError, ConflictError, ContentError } } = require('pyrene-ski-util')
const { ObjectId, models: { User, Lesson } } = require('pyrene-ski-data')

/**
 * Delete a lesson
 * 
 * @param {string} id 
 * @param {lesson} lessonId 
 * 
 * @throws {NotFoundError} validate user with param id to exist
 * @throws {NotFoundError} validate lesson with param lessonId to exist
 * @throws {ConflictError} validate user with param id to own lesson with param lessonId
 * 
 */

module.exports = function(id, lessonId) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(lessonId)
    validate.string.notVoid('lessonId', lessonId)
    if (!ObjectId.isValid(lessonId)) throw new ContentError(`${lessonId} is not a valid lessonid`)

    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const lesson = await Lesson.findById(lessonId)

        if (!lesson) throw new NotFoundError(`user does not have lesson with id ${lessonId}`)

        if (lesson.user.toString() !== id.toString()) throw new ConflictError(`user with id ${id} does not correspond to lesson with id ${lessonId}`)  

        await lesson.deleteOne({ _id: ObjectId(lessonId) })

    })()
}