require('dotenv').config()
const { env: { REACT_APP_DB_URL_TEST: DB_URL_TEST } } = process
//const { expect } = require('chai')
const createTeam = require('.')
const { random } = Math
const { database, models: { User, Team } } = require('pyrene-ski-data')

describe('logic - create team', () => { 
    beforeAll(() => database.connect(DB_URL_TEST))

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

        teamName = `teamName-${random()}`
        teamEmail = `teamEmail-${random()}@mail.com`
        teamPhone = `teamPhone-${random()}`
        teamActivity = `teamActivity-${random()}`

    })

    it('should succeed on correct user and team data', async () => {
        const teamId = await createTeam(id, teamName, teamEmail, teamPhone, teamActivity)

        expect(teamId).toBeDefined()
        expect(teamId).toBe('string')
        expect(teamId).toBeGreaterThan(0)

        const team = await Team.findById(teamId)

        expect(team).toBeDefined()
        expect(team.user.toString()).toEqual(id)
        expect(team.teamName).toEqual(teamName)
        expect(team.teamEmail).toEqual(teamEmail)
        expect(team.teamPhone).toEqual(teamPhone)
        expect(team.teamActivity).toEqual(teamActivity)
    })
    
    afterAll(() => Promise.all([User.deleteMany(), Team.deleteMany() ]).then(database.disconnect)) 

})

