require('dotenv').config()
const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const csrf = require('csurf')
const flash = require('connect-flash')
const exphbs = require('express-handlebars')
const varMiddleware = require('./middleware/vars.middleware')
const userMiddleware = require('./middleware/user.middleware')
const fileMiddleware = require('./middleware/file.middleware')
const error404Handler = require('./middleware/error.middleware')

const app = express()

const store = new MongoStore({ collection: 'sessions', uri: process.env.DB_URI })

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs', helpers: require('./utils/hbs-helpers') }))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

process.env.NODE_ENV !== 'production' && app.use(morgan('dev'))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: false, store }))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(helmet())
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', require('./routes/index.route'))
app.use('/auth', require('./routes/auth.route'))
app.use('/programs', require('./routes/program.route'))
app.use('/orders', require('./routes/order.route'))
app.use('/cart', require('./routes/cart.route'))
app.use('/profile', require('./routes/profile.route'))
app.use(error404Handler)

const start = async () => {
  const PORT = process.env.PORT || 8080
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (e) {
    console.error('Server error', e.message);
  }
}

start()
