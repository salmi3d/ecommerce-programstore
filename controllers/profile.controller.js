const User = require('../models/user.model')

module.exports = class ProfileController {

  static showProfilePage(req, res) {
    res.render('profile', {
      title: 'Profile',
      isProfile: true,
      user: req.user.toObject()
    })
  }

  static async updateProfile(req, res) {
    try {
      const user = await User.findById(req.user._id)
      const toChange = {
        name: req.body.name
      }
      if (req.file) {
        toChange.avatar = req.file.filename
      }
      Object.assign(user, toChange)
      await user.save()
      res.redirect('/profile')
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e })
    }
  }

}
