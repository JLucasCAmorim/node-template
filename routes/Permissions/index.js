var express = require('express')
var router = express.Router()

const auth = require('../../middleware/Auth/jwtValidate')

const permissionsController = require('../../controller/permissionsController')

//cria uma screen
router.post('/', auth, permissionsController.create)

//faz o update do nome e status do disabled
router.put('/:id', auth, permissionsController.update)

//deleta uma screen e remove ela de todas as roles que ja foi assinada
router.delete('/:id', auth, permissionsController.delete)

//pega todas as screens ativas
router.get('/', auth, permissionsController.index)

module.exports = router
