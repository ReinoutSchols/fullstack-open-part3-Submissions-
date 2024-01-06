const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Contact = require('./models/contact')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

// Using morgan to simplify logging
morgan.token('type', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

// Getting all contacts
app.get('/api/persons', (request, response, next) => {
  Contact.find({}).then(contacts => {
    if (contacts) {
      response.json(contacts)
    } else {
      // eslint-disable-next-line no-throw-literal
      throw { status: 404, message: 'No contacts found.' }
    }
  })
    .catch(error => next(error))
})

//  getting the info of the phonebook
app.get('/info', (request, response) => {
  Contact.countDocuments({})
    .then((numberOfEntries) => {
      console.log(numberOfEntries)
      const dateRequest = new Date().toUTCString()
      response.send(`<p>Phonebook has info for ${numberOfEntries} people</p> ${dateRequest}`)
    })
    // eslint-disable-next-line no-undef
    .catch((error) => next(error))
})

// Getting contacts by ID
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  console.log('Fetching person with ID:', id)
  Contact.findById(id)
    .then(result => {
      if (result) {
        response.json(result)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Deleting contacts
app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        // eslint-disable-next-line no-throw-literal
        throw { status: 404, message: 'Contact not found' }
      }
    })
    .catch(error => next(error))
})

// Creating new contacts
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const contact = new Contact({
    name: body.name,
    number: body.number
  })
  contact.save().then(savedContact => {
    console.log('Contact saved successfully:', savedContact)
    response.json(savedContact)
  })
    .catch(error => next(error))
})

// updating contacts
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  Contact.findOne({ name: body.name })
    .then(existingContact => {
      if (existingContact) {
        existingContact.number = body.number
        return existingContact.save()
      } else {
        const newContact = new Contact({
          name: body.name,
          number: body.number
        })
        return newContact.save()
      }
    })
    .then(updatedContact => {
      console.log('Contact updated/saved successfully:', updatedContact)
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    // console.log('Validation error:', error.message)
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
