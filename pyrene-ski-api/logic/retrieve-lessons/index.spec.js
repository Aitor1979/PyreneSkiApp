require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const retrieveLessons = require('.')
const { random } = Math
const { database, ObjectId, models: { User, Lesson, Team } } = require('pyrene-ski-data')

describe('logic - retrieve lessons', () => {
    before(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password, role = "admin"

    beforeEach(async () => { 
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        role = "admin"

        await Promise.all([User.deleteMany(), Lesson.deleteMany()])

        const user = await User.create({ name, surname, email, username, password, role })

        userId = user.id
        teamName = `teamName-${random()}`
        teamEmail = `teamMail-${random()}@mail.com`
        teamPhone = `teamPhone-${random()}`
        teamActivity = `teamActivity-${random()}`

        const team = await Team.create({user: userId, teamName, teamEmail, teamPhone, teamActivity})

        team_Id = team.id
        teamName = team.teamName
        teamActivity = team.teamActivity




        const lessons = await Lesson.create({
                    user: ObjectId(),
                    date: `date-${random()}`,
                    timeStart: `timeStart-${random()}`,
                    timeEnd: `timeEnd-${random()}`,
                    teamId: team_Id
        })
        lessonId = lessons.id.toString()
    })

    it('should succeed on correct user and lesson data', async () => {
        const lessons = await retrieveLessons(userId)

        expect(lessons).to.exist


        lessons.forEach(lesson => {
            expect(lesson.id).to.exist
            expect(lesson.id).to.be.a('string')
            expect(lesson.id).to.have.length.greaterThan(0)
   

            expect(lesson.user).to.equal(userId)

            expect(lesson.date).to.exist
            expect(lesson.date).to.be.a('string')
            expect(lesson.date).to.have.length.greaterThan(0)


            expect(lesson.timeStart).to.exist
            expect(lesson.timeStart).to.be.a('string')
            expect(lesson.timeStart).to.have.length.greaterThan(0)


            expect(lesson.timeEnd).to.exist
            expect(lesson.timeEnd).to.be.a('string')
            expect(lesson.timeEnd).to.have.length.greaterThan(0)


            expect(lesson.teamName).to.equal(teamName)

            expect(lesson.teamName).to.exist
            expect(lesson.teamName).to.be.a('string')
            expect(lesson.teamName).to.have.length.greaterThan(0)


            expect(lesson.teamId.toString()).to.exist
            expect(lesson.teamId.toString()).to.be.a('string')
            expect(lesson.teamId.toString()).to.have.length.greaterThan(0)
           
        })
    })
            after(() => Promise.all([User.deleteMany(), Lesson.deleteMany()]).then(database.disconnect))

})