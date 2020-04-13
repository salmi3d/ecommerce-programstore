const router = new require('express').Router()
const indexCtrl = require('../controllers/index.controller')

router.get('/', indexCtrl.showIndexPage)

module.exports = router
