const call = require('../../utils/call')
const { validate, errors: { NotFoundError, ConflictError, CredentialsError } } = require('pyrene-ski-util')
//const { ObjectId, models: { User, Lesson } } = require('pyrene-ski-data')
const API_URL = process.env.REACT_APP_API_URL

module.exports = function(token, lessonId) {
    validate.string(token)
    validate.string.notVoid('token', token)


    validate.string(lessonId)
    validate.string.notVoid('lessonId', lessonId)


    return (async () => {
        const res = await call(`${API_URL}/lessons/${lessonId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (res.status === 201) return 

        if (res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)

        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)  

        throw new Error(JSON.parse(res.body).message)

    })()
}
