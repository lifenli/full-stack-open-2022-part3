const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result =>
        console.log('connected to MongoDB'))
    .catch(err =>
        console.log('Error occured connecting to MongoDB', err))



const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 9,
        validate: {
            validator: function (v) {
                const reg = /^(\d{2}|\d{3})-\d{4,}$/
                /**Starts with 2 or 3 digits, dash and ends with 4 or more digits */
                return reg.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    }
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)