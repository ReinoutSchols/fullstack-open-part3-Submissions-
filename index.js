const express = require('express')
const morgan = require('morgan');
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

//3.8*: Phonebook backend step8 (created a new token and added to the .use)
morgan.token('type', (req, res) => {
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'));

let persons = [
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

// 3.1: Phonebook backend step1 (Done)
app.get('/api/persons', (request, response) => {
  response.json(persons);
})

// 3.2: Phonebook backend step2
app.get('/info', (request, response) => {
    const numberOfEntries = persons.length;
    const dateRequest =  new Date().toUTCString();
    response.send(`<p>Phonebook has info for ${numberOfEntries} people</p> ${dateRequest}`);
  })

  // 3.3: Phonebook backend step3
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    person ? response.json(person): response.status(404).end();
    
  })

  // 3.4: Phonebook backend step4
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    console.log(id);
    persons = persons.filter(person => person.id !== id);
    console.log(persons);
    response.status(204).end();
})

// 3.5: Phonebook backend step5
// 3.6: Phonebook backend step6

const randomId = () => {
    const randomId = Math.floor(Math.random() * 1000);
    console.log(randomId);
    return randomId;
}

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
      return response.status(400).json({ 
          error: 'name or number is missing' 
      });
  }

  if (persons.some(person => person.name === body.name)) {
      return response.status(400).json({ 
          error: 'name must be unique' 
      });
  }

  const person = { 
      name: body.name, 
      number: body.number,
      id: randomId(),
  };

  persons = persons.concat(person);
  response.status(201).json(person);
});




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

