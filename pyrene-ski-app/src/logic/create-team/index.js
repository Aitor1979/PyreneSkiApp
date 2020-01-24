const call = require('../../utils/call')
const { validate, errors: { NotFoundError, CredentialsError } } = require('pyrene-ski-util')
// const { env: { REACT_APP_API_URL: API_URL } } = process
const API_URL = process.env.REACT_APP_API_URL

module.exports = function (token, teamName, teamEmail, teamPhone, teamActivity) {
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(teamName)
    validate.string.notVoid('teamName', teamName)

    validate.string(teamEmail)
    validate.string.notVoid('teamEmail', teamEmail)

    validate.string(teamPhone)
    validate.string.notVoid('teamPhone', teamPhone)

    validate.string(teamActivity)
    validate.string.notVoid('teamActivity', teamActivity)

    return (async () => {
        const res = await call(`${API_URL}/teams/teamcreate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ teamName, teamEmail, teamPhone, teamActivity })
        })

        if (res.status === 201) return JSON.parse(res.body).id

        if (res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)
        
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}
