require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const Person = require('./models/person')
app.use(express.static('build'))
app.use(express.json())


const amount = Person.length
morgan.token('reqInfo', function (req, res) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqInfo'))


app.get('/info', (request, response) => {
    response.send(
        `< h2 > Phonebook has info for ${amount} persons</h2 >
        <p>${Date()}</p>`
    )
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons =>
        response.json(persons))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person =>
        response.json(person))
})


app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    newPerson.save().then(
        savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
    // const person = {
    //     name: body.name,
    //     number: body.number,
    // }

    Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    // const updatedPersons = [...Person.slice(id, 1)]
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(404).send({ error: 'Malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(404).json({ error: error.message })
    }
    next(error)
}
app.use(errorHandler) // Needs to be at the end

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT} `);
})