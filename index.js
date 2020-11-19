const http = require('http')
const express = require('express')
const { brotliCompress } = require('zlib')
const { response } = require('express')

const app = express()

const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded())
app.use(morgan('dev'))
app.use(cors())
app.use(express.static('build'))


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
    
    } 
    // else if (names.includes(body.name)){
    //     return res.status(400).json({
    //         error: 'Name already in the phonebook'
    //     })
    // }

    const person = new Person ({
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 100000)
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// app.delete('/api/persons/:id', (req, res) => {
//     const id = Number(req.params.id)
//     const filPersons = persons.filter(pers => pers.id !== id)
//     res.status(204).end()
// })

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
    // const id = Number(req.params.id)
    // console.log('id',id)
    // const person = persons.find(per => per.id === id)
    // if (person) {
    //     res.json(person)
    // } else {
    //     res.status(404).end()
    // }
})


// app.get('/info', (req, res) => {
//     const nPersons = persons.length
//     const date = new Date()
//     res.send(`<p>Phonebook has info for ${nPersons} peple</p><p>${date}</p>`)
// })

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.toJSON())
    })
})

const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})