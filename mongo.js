// Exercise 3.12. (Just run it in the command line)
const mongoose = require('mongoose')
const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

if (process.argv.length < 3) {
    console.log('Usage: node script.js <password> [<name> <number>]')
    process.exit(1)
  }
const password = process.argv[2]
const url = `mongodb+srv://reinoutschols:${password}@cluster0.b4imlxs.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url)
const Contact = mongoose.model('Contact', phonebookSchema)

// Check for the right arguments with clean way of defining objects.
if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  const newContact = new Contact({
    name,
    number,
  });
  newContact.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  });
// else log all contacts
} else {
  Contact.find({}).then((contacts) => {
    console.log('phonebook:');
    contacts.forEach((contact) => {
      console.log(contact.name, contact.number)
    })
    mongoose.connection.close();
  });
}