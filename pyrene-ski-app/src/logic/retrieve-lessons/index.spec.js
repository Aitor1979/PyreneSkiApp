require('dotenv').config()
const { env: { REACT_APP_DB_URL_TEST: DB_URL_TEST } } = process

const retrieveLessons = require('.')
const { random } = Math
const { database, ObjectId, models: { User, Lesson } } = require('pyrene-ski-data')

describe('logic - retrieve lessons', () => {
    beforeAll(() => database.connect(DB_URL_TEST))

    let id, name, surname, email, username, password, role, lessonIds, dates, timeStarts, timeEnds, teams, activities

    beforeEach(async () => { 
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        role = 'admin'

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
                date: `date-${random()}`,
                timeStart: `timeStart-${random()}`,
                timeEnd: `timeEnd-${random()}`,
                team : `team-${random()}`,
                activity: `activity-${random()}`
            }

            insertions.push(Lesson.create(lesson).then(lesson => lessonIds.push(lesson.id)))

            dates.push(lesson.date)
            timeStarts.push(lesson.timeStart)
            timeEnds.push(lesson.timeEnd)
            teams.push(lesson.team)
            activities.push(lesson.activity)

        }

        for (let i = 0; i < 10; i++)
            insertions.push(Lesson.create({
                user: ObjectId(),
                date: `date-${random()}`,
                timeStart: `timeStart-${random()}`,
                timeEnd: `timeEnd-${random()}`,
                team : `team-${random()}`,
                activity: `activity-${random()}`
            }))

        await Promise.all(insertions)
  
    })

    it('should succeed on correct user and lesson data', async () => {
        const lessons = await retrieveLessons(id)

        expect(lessons).toBeDefined()
        //expect(lessons).to.have.lengthOf(10)

        lessons.forEach(lesson => {
            expect(lesson.id).toBeDefined()
            expect(lesson.id).toBe('string')
            expect(lesson.id).toBeGreaterThan(0)
            //expect(lesson.id).be.oneOf(lessonIds)

            expect(lesson.user).toEqual(id)

            expect(lesson.date).toBeDefined()
            expect(lesson.date).toBe('string')
            expect(lesson.date).toBeGreaterThan(0)
            //expect(lesson.date).be.oneOf(dates)

            expect(lesson.timeStart).toBeDefined()
            expect(lesson.timeStart).toBe('string')
            expect(lesson.timeStart).toBeGreaterThan(0)
            //expect(lesson.timeStart).be.oneOf(timeStart)

            expect(lesson.timeEnd).toBeDefined()
            expect(lesson.timeEnd).toBe('string')
            expect(lesson.timeEnd).toBeGreaterThan(0)
            //expect(lesson.timeEnd).be.oneOf(timeEnds)

            expect(lesson.team).toBeDefined()
            expect(lesson.team).toBe('string')
            expect(lesson.team).toBeGreaterThan(0)
            //expect(lesson.team).be.oneOf(teams)

            expect(lesson.activity).toBeDefined()
            expect(lesson.activity).toBe('string')
            expect(lesson.activity).toBeGreaterThan(0)
            //expect(lesson.activity).be.oneOf(activities)
        })
    })
            afterAll(() => Promise.all([User.deleteMany(), Lesson.deleteMany()]).then(database.disconnect))

})