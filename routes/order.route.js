const router = new require('express').Router()
const orderCtrl = require('../controllers/order.controller')
const auth = require('../middleware/auth.middleware')

router.get('/', auth, orderCtrl.showAllOrdersPage)
router.post('/', auth, orderCtrl.addOrder)

module.exports = router
