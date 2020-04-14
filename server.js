require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const User = require('./models/user.model')

const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5e95aa598a99263327d0acb1')
    req.user = user
    next()
  } catch (e) {
    console.log(e)
  }
})

process.env.NODE_ENV !== 'production' && app.use(morgan('dev'))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index.route'))
app.use('/programs', require('./routes/program.route'))
app.use('/orders', require('./routes/order.route'))
app.use('/cart', require('./routes/cart.route'))

const start = async () => {
  const PORT = process.env.PORT || 8080
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    const candidate = await User.findOne()
    if (!candidate) {
      const user = new User({
        name: 'salmi',
        email: 'q@qq.ru',
        cart: { items: [] }
      })
      await user.save()
    }
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (e) {
    console.error('Server error', e.message);
  }
}

start()
