const { Schema, model, Types } = require('mongoose')

const orderSchema = new Schema({
  programs: [
    {
      program: {
        type: Object,
        required: true
      },
      count: {
        type: Number,
        required: true
      }
    }
  ],
  user: {
    name: String,
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('Order', orderSchema)
