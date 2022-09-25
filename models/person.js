// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch((err) => console.log('Error occured connecting to MongoDB', err))

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
      validator(v) {
        const reg = /^(\d{2}|\d{3})-\d{4,}$/
        /** Starts with 2 or 3 digits, dash and ends with 4 or more digits */
        return reg.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, 'User phone number required'],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    returnedObject.id = returnedObject._id.toString()
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    delete returnedObject._id
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
