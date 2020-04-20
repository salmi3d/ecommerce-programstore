const { check } = require('express-validator')
const User = require('../models/user.model')

exports.registerValidator = [
  check('name', 'Name must be at least 3 characters')
    .trim()
    .isLength({ min: 3 }),
  check('email', 'Incorrect email address')
    .isEmail()
    .normalizeEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value })
        if (user) {
          return Promise.reject('A user with the given email already exists')
        }
      } catch (e) {
        console.log(e)
      }
    }),
  check('password', 'Your password must be at least 6 characters')
    .isLength({ min: 6 })
    .isAlphanumeric()
    .trim(),
  check('password2')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('This password doesn’t match. Try again.')
      }
      return true
    })
]

exports.loginValidator = [
  check('email', 'Incorrect email address').isEmail().normalizeEmail(),
  check('password', 'Your password must be at least 6 characters').isLength({ min: 6 })
]
