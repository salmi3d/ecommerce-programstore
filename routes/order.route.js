const router = new require('express').Router()
const orderCtrl = require('../controllers/order.controller')

router.get('/', orderCtrl.showAllOrdersPage)
router.post('/', orderCtrl.addOrder)
// router.delete('/remove/:id', orderCtrl.removeItem)

module.exports = router
