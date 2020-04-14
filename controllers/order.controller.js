const Order = require('../models/order.model')

module.exports = class OrderController {

  static async showAllOrdersPage(req, res) {
    try {
      const responseOrders = await Order.find({ 'user.userId': req.user._id }).populate('user.userId').lean()

      const orders = responseOrders.map(o => ({
        ...o,
        total: o.programs.reduce((sum, p) => sum += p.count * p.program.price, 0)
      }))

      res.render('orders', {
        title: 'My orders',
        isOrders: true,
        orders
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e })
    }
  }

  static async addOrder(req, res) {
    try {
      const user = await req.user.populate('cart.items.programId').execPopulate()

      const programs = user.cart.items.map(i => ({
        count: i.count,
        program: { ...i.programId._doc }
      }))

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        programs
      })

      await order.save()
      await req.user.clearCart()
      res.redirect('/orders')
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e })
    }
  }

}
