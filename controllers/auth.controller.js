const bcrypt = require('bcryptjs')
const User = require('../models/user.model')

module.exports = class AuthController {

  static showAuthPage(req, res) {
    res.render('auth/entry', {
      title: 'Authorization',
      isLogin: true,
      loginError: req.flash('loginError'),
      registerError: req.flash('registerError')
    })
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        req.flash('loginError', 'Incorrect login and/or password')
        return res.redirect('/auth/entry#login')
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password)

      if (!isPasswordCorrect) {
        req.flash('loginError', 'Incorrect login and/or password')
        return res.redirect('/auth/entry#login')
      }

      req.session.user = user
      req.session.isAuthenticated = true
      req.session.save(err => {
        if (err) {
          throw err
        }
        res.redirect('/')
      })

    } catch (e) {
      console.log(e)
      res.status(500).json({ error: e })
    }
  }

  static async logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/auth/entry#login')
    })
  }

  static async register(req, res) {
    try {
      const { name, email, password, password2 } = req.body
      const candidate = await User.findOne({ email })

      if (candidate) {
        req.flash('registerError', 'A user with the given email already exists')
        return res.redirect('/auth/entry#register')
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const user = new User({ email, name, password: hashedPassword, cart: { items: [] } })
      await user.save()
      res.redirect('/auth/entry#login')
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: e })
    }
  }

}
