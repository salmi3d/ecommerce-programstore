const { check } = require('express-validator')

exports.programValidator = [
  check('title', 'Title must be at least 3 characters').trim().isLength({ min: 3 }),
  check('price', 'Please enter a correct price').isNumeric(),
  check('img', 'Please enter a valid url').isURL()
]
