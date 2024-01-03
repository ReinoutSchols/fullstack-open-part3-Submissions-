const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

console.log('Connecting to MongoDB...');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('Connected to MongoDB in contact.js');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB in contact.js:', error.message);
    });

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Contact = mongoose.model('Contact', phonebookSchema);

// Check for the right arguments with a clean way of defining objects.
if (process.argv.length === 5) {
    const name = process.argv[3];
    const number = process.argv[4];
    const newContact = new Contact({
        name,
        number,
    });
    newContact.save().then(() => {
        console.log(`Added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
} else {
    Contact.find({}).then((contacts) => {
        console.log('Phonebook:');
        contacts.forEach((contact) => {
            console.log(contact.name, contact.number);
        });
        mongoose.connection.close();
    });
}

module.exports = Contact;
