const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

console.log('Connecting to MongoDB...', url);
mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    });

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3, 
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true, 
    validate: {
        validator: function(v) {
            return /\d{2}-\d{8}/.test(v) || /\d{3}-\d{7}/.test(v)
          }, 
          message: props => `${props.value} is not a valid phone number!`
        }}
    });


phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Contact', phonebookSchema)
