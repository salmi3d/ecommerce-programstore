const Cart = require('../models/cart')
const Program = require('../models/program')


module.exports = class CartController {

  static async addItem(req, res) {
    const program = await Program.getById(req.body.id)
    await Cart.add(program)

    res.redirect('/cart')
  }

  static async removeItem(req, res) {
    const cart = await Cart.remove(req.params.id)
    res.status(200).json(cart)
  }

  static async showCartPage(req, res) {
    const cart = await Cart.fetch()
    res.render('cart', {
      title: 'Cart',
      isCart: true,
      programs: cart.programs,
      total: cart.total
    })
  }

}
