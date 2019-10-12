var express = require('express')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
var routes = require('./routes/routes')
require('./models/database')

var app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

routes(app)

app.use((req, res, next) => {
  if (req.statusCode == null);
  res.status(404).json({ error: 'page not found' })
  next()
})

module.exports = app
