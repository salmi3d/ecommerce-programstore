const fs = require('fs')
const path = require('path')

const PATH = path.join(path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
)

module.exports = class Cart {

  static async add(program) {
    const cart = await Cart.fetch()
    console.error(typeof cart.total);

    const idx = cart.programs.findIndex(p => p.id === program.id)
    const candidate = cart.programs[idx]

    if (candidate) {
      candidate.count++
      cart.programs[idx] = candidate
    } else {
      program.count = 1
      cart.programs.push(program)
    }

    cart.total += +program.price

    return new Promise((resolve, reject) => {
      fs.writeFile(PATH,
        JSON.stringify(cart),
        err => {
          if (err) {
            reject(err)
          }
          resolve()
        }
      )
    })
  }

  static async fetch(program) {
    return new Promise((resolve, reject) => {
      fs.readFile(PATH,
        'utf-8',
        (err, data) => {
          if (err) {
            reject(err)
          }
          resolve(JSON.parse(data))
        }
      )
    })
  }

  static async remove(id) {
    const cart = await Cart.fetch()
    const idx = cart.programs.findIndex(p => p.id === id)
    const program = cart.programs[idx]

    if (program.count === 1) {
      cart.programs = cart.programs.filter(p => p.id !== id)
    } else {
      cart.programs[idx].count--
    }

    cart.total -= program.price

    return new Promise((resolve, reject) => {
      fs.writeFile(PATH,
        JSON.stringify(cart),
        err => {
          if (err) {
            reject(err)
          }
          resolve(cart)
        }
      )
    })
  }

}
