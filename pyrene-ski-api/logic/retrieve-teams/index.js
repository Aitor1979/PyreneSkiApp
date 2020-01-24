const { validate, errors: { NotFoundError, ContentError } } = require('pyrene-ski-util')
const { ObjectId, models: { User, Team } } = require('pyrene-ski-data')

/**
 * Retrieve teams
 * 
 * @param {string} id 
 * 
 * @throws {NotFoundError} validate user with param id to exist
 * 
 * @return {Array} teams
 */

module.exports = function (id) { 
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)


    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        await Team.updateMany( { user: id} )

        const teams = await Team.find({ user: id }, { __v: 0 }).lean()

        teams.forEach(team => {
            team.id = team._id.toString()

            delete team._id
            team.user = id

        })
        
        return teams
    })()
}