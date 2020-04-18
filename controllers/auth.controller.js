const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const User = require('../models/user.model')
const sgMail = require('@sendgrid/mail')
const regEmail = require('../emails/registration.email')
const resetEmail = require('../emails/reset.email')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = class AuthController {

  static showAuthPage(req, res) {
    res.render('auth/entry', {
      title: 'Authorization',
      isLogin: true,
      loginError: req.flash('loginError'),
      registerError: req.flash('registerError')
    })
  }

  static async showNewPasswordPage(req, res) {
    if (!req.params.token) {
      return res.redirect('/auth/entry#login')
    }

    try {
      const user = await User.findOne({
        resetToken: req.params.token,
        resetTokenExp: { $gt: Date.now() }
      })

      if (!user) {
        return res.redirect('/auth/entry#login')
      }

      res.render('auth/new_password', {
        title: 'Set new password',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: user.resetToken
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: e })
    }
  }

  static showResetPage(req, res) {
    res.render('auth/reset', {
      title: 'Reset password',
      error: req.flash('error')
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

  static async setNewPassword(req, res) {
    try {
      const user = await User.findOne({
        _id: req.body.userId,
        resetToken: req.body.token,
        resetTokenExp: { $gt: Date.now() }
      })

      if (!user) {
        req.flash('loginError', `User with email ${req.body.email} doesn't exists or reset token expired`)
        return res.redirect('/auth/entry#login')
      }

      user.password = await bcrypt.hash(req.body.password, 10)
      user.resetToken = undefined
      user.resetTokenExp = undefined
      await user.save()
      res.redirect('/auth/entry#login')
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: e })
    }
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
      sgMail.send(regEmail(email))
      res.redirect('/auth/entry#login')
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: e })
    }
  }

  static reset(req, res) {
    try {
      crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
          req.flash('error', 'Something came up. Please try again later...')
          return res.redirect('/auth/reset')
        }

        const user = await User.findOne({ email: req.body.email })

        if (!user) {
          req.flash('error', `User with email ${req.body.email} doesn't exists`)
          return res.redirect('/auth/reset')
        }

        user.resetToken = buffer.toString('hex')
        user.resetTokenExp = Date.now() + 3600 * 1000
        await user.save()
        sgMail.send(resetEmail(user.email, user.resetToken))
        res.redirect('/auth/entry#login')
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: e })
    }
  }

}
