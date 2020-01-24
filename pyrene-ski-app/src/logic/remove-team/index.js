const call = require('../../utils/call')
const { validate, errors: { NotFoundError, ConflictError, CredentialsError } } = require('pyrene-ski-util')
//const { ObjectId, models: { User, Team } } = require('pyrene-ski-data')
const API_URL = process.env.REACT_APP_API_URL

module.exports = function (token, teamId) {
    validate.string(token)
    validate.string.notVoid('token', token)


    validate.string(teamId)
    validate.string.notVoid('team id', teamId)


    return (async () => {
        const res = await call(`${API_URL}/teams/${teamId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }

        })

        if (res.status === 200) return

        if (res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)

        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}

