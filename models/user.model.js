const { Schema, model, Types } = require('mongoose')

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        programId: {
          type: Types.ObjectId,
          required: true,
          ref: 'Program'
        }
      }
    ]
  }
})

userSchema.methods.addToCart = function (item) {
  const items = [...this.cart.items]
  const idx = items.findIndex(i => i.programId.toString() === item._id.toString())
  if (idx >= 0) {
    items[idx].count++
  } else {
    items.push({
      programId: item._id,
      count: 1
    })
  }

  this.cart = { items }
  return this.save()
}

userSchema.methods.removeFromCart = function (id) {
  let items = [...this.cart.items]
  const idx = items.findIndex(i => i.programId.toString() === id.toString())
  if (items[idx].count === 1) {
    items = items.filter(i => i.programId.toString() !== id.toString())
  } else {
    items[idx].count--
  }

  this.cart = { items }
  return this.save()
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save()
}

module.exports = model('User', userSchema)
