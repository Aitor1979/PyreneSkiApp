require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const removeTeam = require('.')
const { random } = Math
const { errors: { NotFoundError, ConflictError }, polyfills: { arrayRandom}, } = require('pyrene-ski-util')
const { database, ObjectId, models: { User, Team } } = require('pyrene-ski-data')

arrayRandom()

describe('logic - remove team', () => {
    before(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password, role = "admin", teamName, teamEmail, teamPhone, teamActivity

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        role = "admin"

        await Promise.all([User.deleteMany(), Team.deleteMany()])

        const user = await User.create({ name, surname, email, username, password, role })

        id = user.id

        teamIds = []
        teamNames = []
        teamEmails = []
        teamPhones = []
        teamActivities = []

        const insertions = []

        for (let i = 0; i < 10; i++) {
            const team = {
                user: id,
                teamName: `teamName-${random()}`,
                teamEmail: `teamEmail-${random()}@gmail.com`,
                teamPhone: (random()*10),
                teamActivity: `teamActivity-${random()}`
            }

            insertions.push(Team.create(team)
                .then(team => teamIds.push(team.id)))

            teamNames.push(team.teamName)
            teamEmails.push(team.teamEmail)
            teamPhones.push(team.teamPhone)
            teamActivities.push(team.teamActivity)

        }

        for (let i = 0; i < 10; i++)
            insertions.push(Team.create({
                user: ObjectId(),
                teamName: `teamName-${random()}`,
                teamEmail: `teamEmail-${random()}@mail.com`,
                teamPhone: (random()*10),
                teamActivity: `teamActivity-${random()}`
            }))

        await Promise.all(insertions)

    })

    it('should succeed on correct user and team data', async () => {
        const teamId = teamIds.random()

        const response = await removeTeam(id, teamId)

        expect(response).to.not.exist

        const team = await Team.findById(teamId)

        expect(team).to.not.exist
    })

    it('should fail on unexisting user and correct team data', async () => {
        const id = ObjectId().toString()
        const teamId =  teamIds.random()

        try {
            await removeTeam(id, teamId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })

    it('should fail on correct user and unexisting team data', async () => {
        const teamId = ObjectId().toString()

        try {
            await removeTeam(id, teamId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user does not have team with id ${teamId}`)
        }
    })

    after(() => Promise.all([User.deleteMany(), Team.deleteMany()]).then(database.disconnect))

})