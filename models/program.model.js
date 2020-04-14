const { Schema, model, Types } = require('mongoose')

const programSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = model('Program', programSchema)
