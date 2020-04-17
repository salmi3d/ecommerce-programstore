const router = new require('express').Router()
const cartCtrl = require('../controllers/cart.controller')
const auth = require('../middleware/auth.middleware')

router.get('/', auth, cartCtrl.showCartPage)
router.post('/add', auth, cartCtrl.addItem)
router.delete('/remove/:id', auth, cartCtrl.removeItem)

module.exports = router
