require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const createTeam = require('.')
const { random } = Math
const { database, models: { User, Team } } = require('pyrene-ski-data')

describe('logic - create team', () => { 
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

        teamName = `teamName-${random()}`
        teamEmail = `teamEmail-${random()}@mail.com`
        teamPhone = `teamPhone-${random()}`
        teamActivity = `teamActivity-${random()}`

    })

    it('should succeed on correct user and team data', async () => {
        const teamId = await createTeam(id, teamName, teamEmail, teamPhone, teamActivity)

        expect(teamId).to.exist
        expect(teamId).to.be.a('string')
        expect(teamId).to.have.length.greaterThan(0)

        const team = await Team.findById(teamId)

        expect(team).to.exist
        expect(team.user.toString()).to.equal(id)
        expect(team.teamName).to.equal(teamName)
        expect(team.teamEmail).to.equal(teamEmail)
        expect(team.teamPhone).to.equal(teamPhone)
        expect(team.teamActivity).to.equal(teamActivity)
    })
    
    after(() => Promise.all([User.deleteMany(), Team.deleteMany() ]).then(database.disconnect)) 

})

