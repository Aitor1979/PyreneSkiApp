require('dotenv').config()
const { env: { REACT_APP_DB_URL_TEST: DB_URL_TEST } } = process
//const { expect } = require('chai')
const { random } = Math
const retrieveUser = require('.')
const { errors: { NotFoundError } } = require('pyrene-ski-util')
const { database, models: { User } } = require('pyrene-ski-data')

describe('logic - retrieve user', () => {
    beforeAll(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`

        await User.deleteMany()

        const user = await User.create({ name, surname, email, username, password })

        id = user.id
    })

    it('should succeed on correct user id', async () => {
        const user = await retrieveUser(id)

        expect(user).toBeTruthy()
        expect(user.id).toEqual(id)
        expect(user.id).toBe('string')
        expect(user._id).toNotExist()
        expect(user.name).toEqual(name)
        expect(user.name).toBe('string')
        expect(user.surname).toEqual(surname)
        expect(user.surname).toBe('string')
        expect(user.email).toEqual(email)
        expect(user.email).toBe('string')
        expect(user.username).toEqual(username)
        expect(user.username).toBe('string')
        expect(user.password).toBe(undefined)
        //expect(user.lastAccess).toBeTruthy()
        //expect(user.lastAccess).toBen.instanceOf(Date)
    })

    it('should fail on wrong user id', async () => {
        const id = '012345678901234567890123'

        try {
            await retrieveUser(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeTruthy()
            //expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toEqual(`user with id ${id} not found`)
        }
    })


    afterAll(() => User.deleteMany().then(database.disconnect))
})
