const Permissions = require('../models/Permissions')
const Roles = require('../models/Roles')

module.exports = {
  // pega todas as screns
  async index(req, res) {
    const screns = await Permissions.find({ disabled: false })
    return res.status(200).send(screns)
  },

  // cria uma screen
  async create(req, res) {
    const { name } = req.body
    if (name) {
      try {
        const screen = await Permissions.create({ name })
        res.status(200).send(screen)
      } catch (err) {}
    } else {
      return res.status(401).send({ error: 'bad formated data' })
    }
  },

  // faz o update do nome e estado da screen
  async update(req, res) {
    const { name, disabled } = req.body
    const { id } = req.params
    if (name && disabled && id) {
      console.log(name)
      try {
        const screen = await Permissions.updateOne(
          { _id: id },
          { name, disabled }
        )
        if (screen.nModified > 0)
          return res.status(200).send({ message: 'update sucessfull' })
        return res.status(200).send({ message: 'no update maded' })
      } catch (err) {}
    } else {
      return res.status(401).send({ error: 'bad formated data' })
    }
  },

  // deleta um item da lista de screens e remove de todas as roles que contem o id
  async delete(req, res) {
    const { id } = req.params
    try {
      await Roles.find({ pages: id }).then(docs => {
        docs.map(doc => {
          doc.pages = doc.pages.filter(page => {
            return page !== id
          })
          doc.save()
        })
      })

      await Permissions.deleteOne({ _id: id })
      return res.status(200).send({ message: 'deleted sucessfull' })
    } catch (e) {
      return res.status(401).send(e)
    }
  }
}
