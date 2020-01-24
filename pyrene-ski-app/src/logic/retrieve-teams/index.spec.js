require('dotenv').config()
const { env: { REACT_APP_DB_URL_TEST: DB_URL_TEST } } = process
const retrieveTeams = require('.')
const { random } = Math
const { database, ObjectId, models: { User, Team } } = require('pyrene-ski-data')

describe('logic - retrieve teams', () => {
    beforeAll(() => database.connect(DB_URL_TEST))

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

        expect(teams).toBeDefined()
        expect(teams).to.have.lengthOf(20)

        teams.forEach(team => {
            expect(team.id).toBeDefined()
            expect(team.id).toBe('string')
            expect(team.id).toBeGreaterThan(0)
            //expect(team.id).be.oneOf(teamIds)

            expect(team.user).toEqual(id)

            expect(team.teamName).toBeDefined()
            expect(team.teamName).toBe('string')
            expect(team.teamName).toBeGreaterThan(0)
            //expect(team.teamName).be.oneOf(teamNames)

            expect(team.teamEmail).toBeDefined()
            expect(team.teamEmail).toBe('string')
            expect(team.teamEmail).toBeGreaterThan(0)
            //expect(team.teamEmail).be.oneOf(teamEmails)

            expect(team.teamPhone).toBeDefined()
            expect(team.teamPhone).toBe('string')
            expect(team.teamPhone).toBeGreaterThan(0)
            //expect(team.teamPhone).be.oneOf(teamPhones)

            expect(team.teamActivity).toBeDefined()
            expect(team.teamActivity).toBe('string')
            expect(team.teamActivity).toBeGreaterThan(0)
            //expect(team.teamActivity).be.oneOf(teamActivities)


        })
    })


    after(() => Promise.all([User.deleteMany(), Team.deleteMany()]).then(database.disconnect))
})
