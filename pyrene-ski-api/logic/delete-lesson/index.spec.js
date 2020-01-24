require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const deleteLesson = require('.')
const { random } = Math
const { errors: { NotFoundError, ConflictError, ContentError }, polyfills: { arrayRandom}, } = require('pyrene-ski-util')
const { database, ObjectId, models: { User, Lesson, Team } } = require('pyrene-ski-data')

arrayRandom()

describe('logic - delete lesson', () => {
    before(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password, role = "admin", lessonId

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        role = "admin"

    

        await Promise.all([User.deleteMany(), Lesson.deleteMany()])

        const user = await User.create({ name, surname, email, username, password, role })

        id = user.id
        teamName = `teamName-${random()}`
        teamEmail = `teamMail-${random()}@mail.com`
        teamPhone = `teamPhone-${random()}`
        teamActivity = `teamActivity-${random()}`

        const team = await Team.create({user: id, teamName, teamEmail, teamPhone, teamActivity})

        team_Id = team.id
        teamName = team.teamName
        teamActivity = team.teamActivity

        lessonId = ''

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
        //const lessonId =  lessonId.random() //lessons.id.toString()
        //const id = user.id
        try {
            const response = await deleteLesson(id, lessonId)
            expect(response).to.not.exist
            const lesson = await Lesson.findById(lessonId)
            expect(lesson).to.not.exist

        } catch (error) {
            expect(error).to.exist
            
        }


    }) 

     it('should fail on unexisting user and correct lesson data', async () => {
        //const id = ObjectId().toString()
        //const lessonId =  lessonId.random()

        try {
            await deleteLesson(id, lessonId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ConflictError)
            //expect(error.message).to.equal(`user with id ${id} not found`)
        }
    }) 

    it('should fail on correct user and unexisting lesson data', async () => {
        const lessonId = ObjectId().toString()

        try {
            await deleteLesson(id, lessonId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user does not have lesson with id ${lessonId}`)
        }
    })

    after(() => Promise.all([User.deleteMany(), Lesson.deleteMany()]).then(database.disconnect))

})
