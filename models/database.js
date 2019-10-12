const mongoose = require('mongoose')
const {
  mongo: { dev }
} = require('./config')
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

mongoose.connect(
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URI
    : `${dev.url}:${dev.port}/${dev.path}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
)

mongoose.Promise = global.Promise

module.exports = mongoose
