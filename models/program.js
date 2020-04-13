const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')

module.exports = class Program {

  constructor(title, price, img) {
    this.id = uuidv4()
    this.title = title
    this.price = price
    this.img = img
  }

  async save() {
    const programs = await Program.getAll()

    programs.push({
      id: this.id,
      title: this.title,
      price: this.price,
      img: this.img
    })

    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(__dirname, '..', 'data', 'programs.json'),
        JSON.stringify(programs),
        err => {
          if (err) {
            reject(err)
          }
          resolve()
        }
      )
    })
  }

  static async update(program) {
    const programs = await Program.getAll()
    const idx = programs.findIndex(p => p.id === program.id)

    programs[idx] = program

    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(__dirname, '..', 'data', 'programs.json'),
        JSON.stringify(programs),
        err => {
          if (err) {
            reject(err)
          }
          resolve()
        }
      )
    })
  }

  static getAll() {
    return new Promise((resolv, reject) => {
      fs.readFile(path.join(__dirname, '..', 'data', 'programs.json'), 'utf-8', (err, data) => {
        if (err) {
          reject(err)
        }
        resolv(JSON.parse(data))
      })
    })
  }


  static async getById(id) {
    const programs = await Program.getAll()

    return programs.find(p => p.id === id)
  }

}
