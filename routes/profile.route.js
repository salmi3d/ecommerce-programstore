const router = new require('express').Router()
const auth = require('../middleware/auth.middleware')
const profileCtrl = require('../controllers/profile.controller')

router.route('/')
  .get(auth, profileCtrl.showProfilePage)
  .post(auth, profileCtrl.updateProfile)

module.exports = router
