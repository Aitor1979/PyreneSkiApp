const { validate, errors: { NotFoundError, ConflictError, ContentError } } = require('pyrene-ski-util')
const { ObjectId, models: { User, Team } } = require('pyrene-ski-data')

module.exports = function (id, teamId) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(teamId)
    validate.string.notVoid('team id', teamId)
    if (!ObjectId.isValid(teamId)) throw new ContentError(`${teamId} is not a valid teamId`)

    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const team = await Team.findById(teamId)

        if (!team) throw new NotFoundError(`user does not have team with id ${teamId}`)

        if (team.user.toString() !== id.toString()) throw new ConflictError(`user with id ${id} does not correspond to task with id ${teamId}`)

        await Team.deleteOne({ _id: ObjectId(teamId) })
    })()
}

