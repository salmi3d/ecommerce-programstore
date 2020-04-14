const Program = require('../models/program.model')

module.exports = class CartController {

  static async addItem(req, res) {
    try {
      const program = await Program.findById(req.body.id)
      await req.user.addToCart(program)
      res.redirect('/cart')
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e })
    }
  }

  static async removeItem(req, res) {
    try {
      await req.user.removeFromCart(req.params.id)
      const user = await req.user.populate('cart.items.programId').execPopulate()
      const programs = CartController.mapItems(user.cart)
      const cart = {
        programs,
        total: CartController.calcTotal(programs)
      }
      res.status(200).json(cart)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e })
    }
  }

  static async showCartPage(req, res) {
    const user = await req.user.populate('cart.items.programId').execPopulate()
    const programs = CartController.mapItems(user.cart)

    res.render('cart', {
      title: 'Cart',
      isCart: true,
      programs: programs,
      total: CartController.calcTotal(programs)
    })
  }

  static mapItems(cart) {
    return cart.items.map(i => ({
      ...i.programId._doc,
      count: i.count
    }))
  }

  static calcTotal(programs) {
    return programs.reduce((total, program) => {
      return total += program.price * program.count
    }, 0)
  }

}
