require('dotenv').config()
const { env: { DB_URL_TEST } } = process
const { expect } = require('chai')
const deleteLesson = require('.')
const { random } = Math
const { errors: { NotFoundError, ConflictError }, polyfills: { arrayRandom}, } = require('pyrene-ski-util')
const { database, ObjectId, models: { User, Lesson } } = require('pyrene-ski-data')

arrayRandom()

describe('logic - delete lesson', () => {
    before(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password, role = "admin", date, timeStart, timeEnd, team , activity

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

        lessonIds = []
        dates = []
        timeStarts = []
        timeEnds = []
        teams = []
        activities = []
 
        const insertions = []

        for (let i = 0; i < 10; i++) {
            const lesson = {
                user: id,
                date : `date-${random()}`,
                timeStart : `timeStart-${random()}`,
                timeEnd : `timeEnd-${random()}`,
                team : `team-${random()}`,
                activity: `activity-${random()}`
                
            }

            insertions.push(Lesson.create(lesson)
                .then(lesson => lessonIds.push(lesson.id)))

            dates.push(lesson.date)
            timeStarts.push(lesson.timeStart)
            timeEnds.push(lesson.timeEnd)
            teams.push(lesson.team)
            activities.push(lesson.activity)
        }

        for (let i = 0; i < 10; i++)
            insertions.push(Lesson.create({
                user: ObjectId(),
                date : `date-${random()}`,
                timeStart : `timeStart-${random()}`,
                timeEnd : `timeEnd-${random()}`,
                team : `team-${random()}`,
                activity: `activity-${random()}`
            }))

        await Promise.all(insertions) 

    })

    it('should succeed on correct user and lesson data', async () => {
        const lessonId = lessonIds.random()

        const response = await deleteLesson(id, lessonId)

        expect(response).to.not.exist

        const lesson = await Lesson.findById(lessonId)

        expect(lesson).to.not.exist
    })

    it('should fail on unexisting user and correct lesson data', async () => {
        const id = ObjectId().toString()
        const lessonId =  lessonIds.random()

        try {
            await deleteLesson(id, lessonId)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
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