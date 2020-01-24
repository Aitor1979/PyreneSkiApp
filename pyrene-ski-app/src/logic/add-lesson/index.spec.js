require('dotenv').config()
const { env: { REACT_APP_DB_URL_TEST: DB_URL_TEST} } = process
//const { expect } = require('chai')
const addLesson = require('.')
const { random } = Math
const { database, models: { User, Team, Lesson } } = require('pyrene-ski-data')

describe('logic - add lesson', () => {
    beforeAll(() => database.connect(DB_URL_TEST))

    let userId, name, surname, email, username, password, role = "admin", date, timeStart, timeEnd, team, activity

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

        date = `date-${random()}`
        timeStart = `timeStart-${random()}`
        timeEnd = `timeEnd-${random()}`
        team = `team-${random()}`
        activity = `activity-${random()}`
    })

    it('should succeed on correct user and lesson data', async () => { 
        const lessonId = await addLesson(userId, date, timeStart, timeEnd, team, activity)

        expect(lessonId).toBeDefined()
        expect(lessonId).toBe('string')
        expect(lessonId).toBeGreaterThan(0)

        const lesson = await Lesson.findById(lessonId)

        expect(lesson).toBeDefined()
        expect(lesson.user.toString()).toEqual(userId)
        expect(lesson.date).toEqual(date)
        expect(lesson.timeStart).toEqual(timeStart)
        expect(lesson.timeEnd).toEqual(timeEnd)
        expect(lesson.team).toEqual(team)
        expect(lesson.activity).toEqual(activity)

    })

    afterAll(() => Promise.all([User.deleteMany(), Lesson.deleteMany()]).then(database.disconnect)) 
})