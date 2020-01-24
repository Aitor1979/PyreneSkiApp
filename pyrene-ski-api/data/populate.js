require('dotenv').config()
const { database, models: { User, Lesson, Team } } = require('pyrene-ski-data')
const { env: { DB_URL } } = process;

(async () => {
    try {
        await database.connect(DB_URL)

        // await Promise.all([User.deleteMany(), Lesson.deleteMany(), Team.deleteMany()])
        await User.deleteMany()
        await Lesson.deleteMany()
        await Team.deleteMany()

        const user = new User({
            name: 'admin79',
            surname: 'admin79',
            email: 'admin@mail.com',
            username: 'admin79',
            password: '123',
            role: 'admin',
            teams:[],
            lessons:[],
            lessontobuy:[]

        })

        await user.save()
    } catch (error) {
        console.error(error)
    }
})()