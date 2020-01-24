const { Router } = require('express')
const { addLesson, retrieveLessons, deleteLesson, addLessonWithTeamData, buyLesson } = require('../../logic')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const { errors: { NotFoundError, ConflictError, CredentialsError } } = require('pyrene-ski-util')
const jsonBodyParser = bodyParser.json()

const router = Router()

router.post('/lessonadd', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, body: { date, timeStart, timeEnd, teamId } } = req

        addLesson(id, date, timeStart, timeEnd, teamId)
            .then(id => res.status(201).json({ id }))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })    
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.get('/lessonlist', tokenVerifier, (req, res) => {
    try {
        const { id } = req

        retrieveLessons(id)
            .then(lessons => res.json(lessons))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.post('/:lessonId', tokenVerifier, (req, res) => {
    try {
        const { id, params: { lessonId } } = req

        deleteLesson(id, lessonId)
            .then(() => 
                res.end()
            )
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof NotFoundError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
                
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }

})


/* router.post('/lessonbuy', tokenVerifier, jsonBodyParser, (req, res) => {
    try {
        const { id, body: { date, timeStart, timeEnd, team, activity } } = req

        buyLesson(id, date, timeStart, timeEnd, team, activity, )
            .then(id => res.status(201).json({ id }))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })    
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
}) */


module.exports = router
