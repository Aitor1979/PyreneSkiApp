const call = require('../../utils/call')
const { validate, errors: { NotFoundError, CredentialsError } } = require('pyrene-ski-util')
// const { env: { REACT_APP_API_URL: API_URL } } = process
const API_URL = process.env.REACT_APP_API_URL

module.exports = function (token, date, timeStart, timeEnd, teamId ) {
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(date)
    validate.string.notVoid('date', date)

    validate.string(timeStart)
    validate.string.notVoid('timeStart', timeStart)

    validate.string(timeEnd)
    validate.string.notVoid('timeEnd', timeEnd)

    return (async () => {
        const res = await call(`${API_URL}/lessons/lessonadd`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, timeStart, timeEnd, teamId })
        })

        if (res.status === 201) return JSON.parse(res.body).id

        if (res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)
        
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}
