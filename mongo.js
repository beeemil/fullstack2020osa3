const mongoose = require('mongoose')

const password = process.argv[2]

const url =
  `mongodb+srv://emiel:${password}@cluster0.nlhlz.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
  } else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(response => {
    console.log('Added',process.argv[3], 'number', process.argv[4],'to phonebook')
    mongoose.connection.close()
    })
  }