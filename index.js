const http = require('http')
const express = require('express')
const { brotliCompress } = require('zlib')
const { response } = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

let persons = [
    { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
    },
    { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
    },
    { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
    },
    { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
    }
]

app.use(express.json())
app.use(express.urlencoded())
app.use(morgan('dev'))
app.use(cors())


app.post('/api/persons',(req,res) => {
    console.log('body',req.body)
    const body = req.body
    const names = persons.map(person => person.name)
    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    
    } else if (names.includes(body.name)){
        return res.status(400).json({
            error: 'Name already in the phonebook'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 100000)
    }
    persons = persons.concat(person)
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const filPersons = persons.filter(pers => pers.id !== id)
    res.status(204).end()
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log('id',id)
    const person = persons.find(per => per.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})


app.get('/info', (req, res) => {
    const nPersons = persons.length
    const date = new Date()
    res.send(`<p>Phonebook has info for ${nPersons} peple</p><p>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

const PORT = process.env.PORT || 3001 
app.listen(PORT)
console.log(`Server running on port ${PORT}`)