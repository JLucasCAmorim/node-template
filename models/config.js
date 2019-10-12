module.exports = {
  mongo: {
    dev: {
      url:
        process.env.NODE_ENV === 'production'
          ? process.env.MONGODB_URI
          : 'mongodb://127.0.0.1',
      path: 'BSS',
      port: 27017
    }
  },
  hash: '1d11a4e6e77ef385c5fbb881e40ca2c4'
}
