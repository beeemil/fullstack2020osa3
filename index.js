require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



app.use(express.json())
app.use(express.urlencoded())
app.use(morgan('dev'))
app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())

app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => {
		res.json(persons)
	})
})

app.post('/api/persons',(req, res, next) => {
	console.log('body',req.body)
	const body = req.body
	const person = new Person ({
		name: body.name,
		number: body.number,
	})
	person.save().then(savedPerson => {
		res.json(savedPerson)
	})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body
	console.log('Body',body)
	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(req.params.id, person, {new: true})
		.then(updatedPerson => {
			res.json(updatedPerson)
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		// eslint-disable-next-line no-unused-vars
		.then(_result => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then(person => {
			if (person) {
				res.json(person)
			} else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
	console.error(error.message)
	if (error.name === 'CastError' && error.kind === 'ObjectId'){
		return res.status(400).send({error: 'malformatted id'})
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({error: error.message})
	}
	next(error)
}
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})