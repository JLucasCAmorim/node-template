const Role = require('../models/Roles')
const User = require('../models/User')

module.exports = {
  async index(req, res) {
    const { page = 1, name } = req.query
    const query = Role.find({
      name: { $regex: new RegExp(name, 'i') }
    })

    const roles = await Role.paginate(query, {
      page,
      select: 'name disable',
      limit: 10
    })
    return res.status(200).send(roles)
  },
  async create(req, res) {
    const { name, permissions } = req.body
    try {
      if (!Array.isArray(permissions) || permissions.length === 0)
        return res
          .status(403)
          .send({ error: 'pages must be array with length > 0' })

      const createdRole = await Role.create({ name, permissions })

      return res.status(200).send(createdRole)
    } catch (e) {
      return res.status(400).send({ error: 'Unable to duplicate role' })
    }
  },
  async edit(req, res) {
    const { id } = req.params
    try {
      const role = await Role.findOne({ _id: id })
      if (role) return res.status(200).send(role)

      return res.status(404).send({ error: 'Role not Found' })
    } catch (e) {
      return res.status(404).send({ error: 'Invalid id' })
    }
  },
  async update(req, res) {
    const { id } = req.params
    const { name, permissions } = req.body

    if (!Array.isArray(permissions) || permissions.length === 0)
      return res
        .status(403)
        .send({ error: 'pages must be array with length > 0' })

    const updateOne = await Role.updateOne({ _id: id }, { name, permissions })
    if (updateOne.nModified > 0)
      return res.status(200).send({ message: 'Role updated' })
    return res.status(400).send({ error: 'No roles updated' })
  },

  async delete(req, res) {
    const { id } = req.params
    Role.findById(id, function(err, role) {
      if (err) throw err
      if (role.users.length > 0) {
        role.users.forEach(function(userId) {
          User.findById(userId, function(err, user) {
            if (err) {
              throw err
            } else {
              const roles = user.roles
              if (roles.indexOf(id) !== -1) {
                const index = roles.indexOf(id)
                roles.splice(index, 1)
                user.roles = roles
              }
              const { email, name, password } = user
              user.email = email
              user.name = name
              user.password = password
              console.log('user', user)
              user.save(function(err) {
                if (err) throw err
                console.log('Updated user!')
              })
            }
          })
        })
      }
      role.remove(function(err) {
        if (err) throw err
        return res.status(200).send({ message: 'Role deleted cascade' })
      })
    })
  }
}
