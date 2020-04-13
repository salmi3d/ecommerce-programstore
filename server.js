require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')

const app = express()


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.set('views', 'views')

process.env.NODE_ENV !== 'production' && app.use(morgan('dev'))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index.route'))
app.use('/programs', require('./routes/program.route'))
app.use('/cart', require('./routes/cart.route'))

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
