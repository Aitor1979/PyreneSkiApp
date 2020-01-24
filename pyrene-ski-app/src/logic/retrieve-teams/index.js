const call = require('../../utils/call')
const { validate, errors: { NotFoundError, CredentialsError } } = require('pyrene-ski-util')
// const { env: { REACT_APP_API_URL: API_URL } } = process
const API_URL = process.env.REACT_APP_API_URL

module.exports = function (token) {
    validate.string(token)
    validate.string.notVoid('token', token)

    return (async () => {
        const res = await call(`${API_URL}/teams/teamlist`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (res.status === 200) {
            const teams = JSON.parse(res.body)

            return teams
        }

        if (res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)
        
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}



/* const { validate, errors: { NotFoundError, ContentError } } = require('pyrene-ski-util')
const { ObjectId, models: { User, Team } } = require('pyrene-ski-data')

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
} */