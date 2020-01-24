const { Router } = require('express')
const { createTeam, retrieveTeams, removeTeam } = require('../../logic')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const { errors: { NotFoundError, ConflictError, CredentialsError } } = require('pyrene-ski-util')

const jsonBodyParser = bodyParser.json()

const router = Router()

router.post('/teamcreate', tokenVerifier, jsonBodyParser, (req, res) => { 
    try {
        const { id, body: { teamName, teamEmail, teamPhone, teamActivity } } = req

        createTeam(id, teamName, teamEmail, teamPhone, teamActivity)
            .then(id => res.status(201).json({ id }))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(400).json({ message })    
            })
    } catch ({ message }) {
        res.status(500).json({ message })
    }
})

router.get('/teamlist', tokenVerifier, (req, res) => {
    try {
        const { id } = req

        retrieveTeams(id)
            .then(teams => res.json(teams))
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

router.post('/:teamId', tokenVerifier, (req, res) => {
    try {
        const { id, params: { teamId } } = req

        removeTeam(id, teamId)
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

module.exports = router
