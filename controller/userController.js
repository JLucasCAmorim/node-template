const User = require('../models/User')
const Permission = require('../models/Permissions')
const Role = require('../models/Roles')
const hash = require('../models/config').hash
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
  async index(req, res) {
    const { page = 1, filter } = req.query
    const regEx = new RegExp(filter, 'i')
    const query = User.find(
      {
        $or: [{ name: { $regex: regEx } }, { email: { $regex: regEx } }]
      },
      { password: 0 }
    )

    query.populate('roles')

    const users = await User.paginate(query, {
      page,
      limit: 10
    })
    return res.status(200).send(users)
  },
  async create(req, res) {
    const { email, name, roles } = req.body

    if (!email) return res.status(400).send({ error: 'No email provided' })
    if (!name) return res.status(400).send({ error: 'No name provided' })

    try {
      if (await User.findOne({ email }))
        return res.status(400).send({ error: 'User already existes' })

      const user = await User.create(req.body)
      if (roles) {
        roles.forEach(id => {
          Role.findById(id, function(err, role) {
            if (err) throw err
            role.users.push(user._id)
            role.save(function(err) {
              if (err) throw err
              console.log('Updated role!')
            })
          })
        })
      }

      user.password = undefined
      return res.send(user)
    } catch (err) {
      console.log(err)
      return res.status(400).send({ error: 'Registration failed' })
    }
  },
  async login(req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) return res.status(401).send({ error: 'User not Found.' })

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).send({ error: 'Password Invalid' })

    user.password = undefined

    const token = jwt.sign({ id: user.id, companyId: user.company }, hash, {
      expiresIn: 86400
    })

    return res.send({ user, token })
  },
  async current(req, res) {
    const user = await User.findOne({ _id: req.userId }).select('-password')
    const rolesPermissions = []
    const roles = []
    const permissions = []
    for (const role of user.roles) {
      const aux = await Role.findOne({ _id: role, disabled: false })
      rolesPermissions.push(...aux.permissions)
      roles.push(aux.name)
    }
    for (const permission of rolesPermissions) {
      const aux = await Permission.findOne({ _id: permission, disabled: false })
      permissions.push(aux.name)
    }
    user.roles = roles
    res.json({ user, permissions, rolesName: roles })
  },
  async edit(req, res) {
    const { id } = req.params
    try {
      const user = await User.findOne({ _id: id })
      if (user) return res.status(200).send(user)
      return res.status(404).send({ error: "Can't find this user" })
    } catch (e) {
      return res.status(404).send({ error: 'Invalid id' })
    }
  },
  async update(req, res) {
    const { id } = req.params
    const { email, name, roles, password } = req.body

    if (!Array.isArray(roles) || roles.length === 0)
      return res
        .status(403)
        .send({ error: 'pages must be array with length > 0' })

    User.findById(id, function(err, user) {
      if (err) throw err
      user.roles.forEach(function(roleId) {
        Role.findById(roleId, function(err, role) {
          if (err) throw err
          const roleUsers = role.users
          if (roleUsers.indexOf(id) !== -1) {
            const index = roleUsers.indexOf(id)
            roleUsers.splice(index, 1)
            role.users = roleUsers
          }
          role.save(function(err) {
            if (err) throw err
            console.log('Updated role!')
          })
        })
      })
      user.roles = roles || user.roles
      user.email = email || user.email
      user.name = name || user.name
      user.password = password || user.password
      user.save(function(err) {
        if (err) throw err
        roles.forEach(id => {
          Role.findById(id, function(err, role) {
            if (err) throw err
            if (role.users.indexOf(user._id) === -1) role.users.push(user._id)
            role.save(function(err) {
              if (err) throw err
              console.log('Updated role!')
            })
          })
        })
        console.log('Updated User!')
        return res.status(200).send({ message: 'User updated' })
      })
    })
  },

  async delete(req, res) {
    const { id } = req.params
    User.findById(id, function(err, user) {
      if (err) throw err
      if (user.roles.length > 0) {
        user.roles.forEach(function(roleId) {
          Role.findById(roleId, function(err, role) {
            if (err) {
              throw err
            } else {
              const users = role.users
              if (users.indexOf(id) !== -1) {
                const index = users.indexOf(id)
                users.splice(index, 1)
                role.users = users
              }
              const { name } = role
              role.name = name
              role.save(function(err) {
                if (err) throw err
                console.log('Updated role!')
              })
            }
          })
        })
      }
      user.remove(function(err) {
        if (err) throw err
        return res.status(200).send({ message: 'user deleted cascade' })
      })
    })
  }
}
