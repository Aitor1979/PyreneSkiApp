require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const retrieveTeams = require('.')
const { random } = Math
const { database, ObjectId, models: { User, Team } } = require('pyrene-ski-data')

describe('logic - retrieve teams', () => {
    before(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password, role, teamIds, teamNames, teamEmails, teamPhones, teamActivities

    beforeEach(async () => { 
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        role = 'admin'

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
                teamPhone: `teamPhone-${random()}`,
                teamActivity: `teamActivity-${random()}`
            }

            insertions.push(Team.create(team).then(team => teamIds.push(team.id)))

            teamNames.push(team.teamName)
            teamEmails.push(team.teamEmail)
            teamPhones.push(team.teamPhone)
            teamActivities.push(team.teamActivity)
        }

        for (let i = 0; i < 10; i++)
            insertions.push(Team.create({
                user: ObjectId(),
                teamName: `teamName-${random()}`,
                teamEmail: `teamEmail-${random()}@gmail.com`,
                teamPhone: `teamPhone-${random()}`,
                teamActivity: `teamActivity-${random()}`
            }))

        await Promise.all(insertions)
  
    })

    it('should succeed on correct user and team data', async () => {
        const teams = await retrieveTeams(id)

        expect(teams).to.exist
        expect(teams).to.have.lengthOf(20)

        teams.forEach(team => {
            expect(team.id).to.exist
            expect(team.id).to.be.a('string')
            expect(team.id).to.have.length.greaterThan(0)
            //expect(team.id).be.oneOf(teamIds)

            expect(team.user).to.equal(id)

            expect(team.teamName).to.exist
            expect(team.teamName).to.be.a('string')
            expect(team.teamName).to.have.length.greaterThan(0)
            //expect(team.teamName).be.oneOf(teamNames)

            expect(team.teamEmail).to.exist
            expect(team.teamEmail).to.be.a('string')
            expect(team.teamEmail).to.have.length.greaterThan(0)
            //expect(team.teamEmail).be.oneOf(teamEmails)

            expect(team.teamPhone).to.exist
            expect(team.teamPhone).to.be.a('string')
            expect(team.teamPhone).to.have.length.greaterThan(0)
            //expect(team.teamPhone).be.oneOf(teamPhones)

            expect(team.teamActivity).to.exist
            expect(team.teamActivity).to.be.a('string')
            expect(team.teamActivity).to.have.length.greaterThan(0)
            //expect(team.teamActivity).be.oneOf(teamActivities)


        })
    })

    // TODO other test cases

    after(() => Promise.all([User.deleteMany(), Team.deleteMany()]).then(database.disconnect))
})
