const router = new require('express').Router()
const cartCtrl = require('../controllers/cart.controller')

router.get('/', cartCtrl.showCartPage)
router.post('/add', cartCtrl.addItem)
router.delete('/remove/:id', cartCtrl.removeItem)

module.exports = router
