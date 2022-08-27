const express = require('express')
const app = express()
var morgan = require('morgan')
app.use(express.static('build'))


const persons =
    [
        {
            "id": 1,
            "name": "Arto Hellas",
            "number": "040-123456"
        },
        {
            "id": 2,
            "name": "Ada Lovelace",
            "number": "39-44-5323523"
        },
        {
            "id": 3,
            "name": "Dan Abramov",
            "number": "12-43-234345"
        },
        {
            "id": 4,
            "name": "Mary Poppendieck",
            "number": "39-23-6423122"
        }
    ]

const amount = persons.length
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
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) {
        return response.status(404).end()
    } else {
        response.json(person)
    }
})

app.use(express.json())
app.post('/api/persons', (request, response) => {
    function getRandomIdInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }

    const createdNewId = () => {
        const newId = persons.length > 0
            ? getRandomIdInclusive(1, 100)
            : 0
        return newId + 1
    }
    const body = request.body
    const newPerson = {
        id: createdNewId(),
        name: body.name,
        number: body.number
    }

    !newPerson.name && response.status(404).json({ error: 'Name is missing' })
    !newPerson.number && response.status(404).json({ error: 'Number is missing' })
    persons.find(person => person.name === newPerson.name) && response.status(404).json({ error: 'This person already exists' })
    persons.concat(newPerson)
    response.json(newPerson)
})



app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    const updatedPersons = [...persons.slice(id, 1)]
    if (!person) {
        return response.status(404).end()
    } else {
        response.json(updatedPersons)
    }
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT} `);
})