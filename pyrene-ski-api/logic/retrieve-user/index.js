const { validate, errors: { NotFoundError, ContentError } } = require('pyrene-ski-util')
const { ObjectId, models: { User } } = require('pyrene-ski-data')

/**
 * Retrieve user 
 * 
 * @param {string} id
 * 
 * @return {Object} id, name, surname, email, username, role, teams, lessons
 * 
 * @throws {ContentError} validate param id: user id with value param is not a valid id
 * @throws {NotFoundError} validate user with param id to exist
 * 
 */


module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        //user.lastAccess = new Date

        await user.save()

        const { name, surname, email, username, role, teams, lessons /* lastAccess */ } = user.toObject()

        return { id, name, surname, email, username, role, teams, lessons /* lastAccess */ }
    })()
}
