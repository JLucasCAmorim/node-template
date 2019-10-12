const homeRouter = require('./Home')
const usersRouter = require('./Users')
const rolesRouter = require('./Roles')
const permissionRouter = require('./Permissions')

module.exports = app => {
  app.use('/users', usersRouter)
  app.use('/roles', rolesRouter)
  app.use('/home', homeRouter)
  app.use('/permissions', permissionRouter)
}
