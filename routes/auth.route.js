const router = new require('express').Router()
const authCtrl = require('../controllers/auth.controller')
const auth = require('../middleware/auth.middleware')

router.get('/entry', authCtrl.showAuthPage)

router.route('/reset')
  .get(authCtrl.showResetPage)
  .post(authCtrl.reset)

router.route('/password/:token')
  .get(authCtrl.showNewPasswordPage)
  .post(authCtrl.setNewPassword)

router.get('/logout', auth, authCtrl.logout)
router.post('/login', authCtrl.login)
router.post('/register', authCtrl.register)

module.exports = router
