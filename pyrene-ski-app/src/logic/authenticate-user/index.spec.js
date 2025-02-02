require('dotenv').config()
const { env: { REACT_APP_DB_URL_TEST: DB_URL_TEST } } = process
//const { expect } = require('chai')
const authenticateUser = require('.')
const { random } = Math
const { errors: { ContentError, CredentialsError } } = require('pyrene-ski-util')

const { database, models: { User } } = require('pyrene-ski-data')

describe('logic - authenticate user', () => {
    beforeAll(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password, role

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`

        await User.deleteMany()

        const user = await User.create({ name, surname, email, username, password, role })

        id = user.id
    })

    it('should succeed on correct credentials', async () => {
        const userId = await authenticateUser(username, password)

        expect(userId).toBeTruthy()
        expect(typeof userId).toEqual('string')
        expect(userId.length).toBeGreaterThan(0)

        expect(userId).toEqual(id)
    })

    describe('when wrong credentials', () => {
        it('should fail on wrong username', async () => {
            const username = 'wrong'

            try {
                await authenticateUser(username, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).toBeTruthy()
                expect(error).toBeInstanceOf(CredentialsError)

                const { message } = error
                expect(message).toEqual(`wrong credentials`)
            }
        })

        it('should fail on wrong password', async () => {
            const password = 'wrong'

            try {
                await authenticateUser(username, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).toBeTruthy()
                expect(error).toBeInstanceOf(CredentialsError)

                const { message } = error
                expect(message).toEqual(`wrong credentials`)
            }
        })
    })

     it('should fail on incorrect name, surname, email, password, or expression type and content', () => {
        expect(() => authenticateUser(1)).toThrow(TypeError, '1 is not a string')
        expect(() => authenticateUser(true)).toThrow(TypeError, 'true is not a string')
        expect(() => authenticateUser([])).toThrow(TypeError, ' is not a string')
        expect(() => authenticateUser({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => authenticateUser(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => authenticateUser(null)).toThrow(TypeError, 'null is not a string')

        expect(() => authenticateUser('')).toThrow(ContentError, 'username is empty or blank')
        expect(() => authenticateUser(' \t\r')).toThrow(ContentError, 'username is empty or blank')

        expect(() => authenticateUser(email, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => authenticateUser(email, true)).toThrow(TypeError, 'true is not a string')
        expect(() => authenticateUser(email, [])).toThrow(TypeError, ' is not a string')
        expect(() => authenticateUser(email, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => authenticateUser(email, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => authenticateUser(email, null)).toThrow(TypeError, 'null is not a string')

        expect(() => authenticateUser(email, '')).toThrow(ContentError, 'password is empty or blank')
        expect(() => authenticateUser(email, ' \t\r')).toThrow(ContentError, 'password is empty or blank')
    }) 

    // TODO other cases

    afterAll(() => User.deleteMany().then(database.disconnect))
})
