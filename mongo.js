const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url = `mongodb+srv://username:password@cluster0.cuo81ph.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

mongoose
    .connect(url)
    .then((result) => {
        const person = new Person({
            name: `${personName}`,
            number: `${personNumber}`
        })
        if (!personName || !personNumber) {
            console.log('Phonebook')
            Person.find({}).then(result => {
                result.forEach(person => {
                    console.log(`${person.name} ${person.number}`)
                })
            })
        } else {
            console.log(`Added ${personName} number ${personNumber} to phonebook`);
            return person.save()
        }
        mongoose.connection.close()
    })
    .catch((err) => console.log(err))

