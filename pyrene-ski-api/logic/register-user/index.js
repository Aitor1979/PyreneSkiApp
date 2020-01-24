const { validate, errors: { ConflictError } } = require('pyrene-ski-util')
const { models: { User } } = require('pyrene-ski-data')

/**
 * Register user
 * 
 * @param {string} name 
 * @param {string} surname 
 * @param {string} email 
 * @param {string} username 
 * @param {string} password 
 * @param {string} role 
 * @param {Object} teams 
 * @param {Object} lessons 
 * 
 * @return {Promise}
 */

module.exports = function (name, surname, email, username, password, role, teams, lessons) {
    validate.string(name)
    validate.string.notVoid('name', name)
    validate.string(surname)
    validate.string.notVoid('surname', surname)
    validate.string(email)
    validate.string.notVoid('e-mail', email)
    validate.email(email)
    validate.string(username)
    validate.string.notVoid('username', username)
    validate.string(password)
    validate.string.notVoid('password', password)


    return (async () => {
        const user = await User.findOne({ username })

        if (user) throw new ConflictError(`user with username ${username} already exists`)

        let teams = undefined
        let lessons = undefined

        if (role === 'client') arr = []


        await User.create({ name, surname, email, username, password, role, teams, lessons })
    })()
}
