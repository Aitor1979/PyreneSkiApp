
const { validate, errors: { CredentialsError } } = require('pyrene-ski-util')
const { models: { User } } = require('pyrene-ski-data')

/**
 * Authenticates a user by its credentials
 * 
 * @param {string} username 
 * @param {string} password 
 * 
 * @returns {Promise}
 * 
 * @throws {CredentialsError} validate user with param value username and password to exist
 */



module.exports = function (username, password) {
    validate.string(username)
    validate.string.notVoid('username', username)
    validate.string(password)
    validate.string.notVoid('password', password)

    return (async () => {
        const user = await User.findOne({ username, password })

        if (!user) throw new CredentialsError('wrong credentials')

        user.lastAccess = new Date

        await user.save()

        return user.id
    })()
}
