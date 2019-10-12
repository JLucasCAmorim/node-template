var express = require('express')
var router = express.Router()

const auth = require('../../middleware/Auth/jwtValidate')

const rolesController = require('../../controller/rolesController')

router.post('/', auth, rolesController.create)

router.put('/:id', auth, rolesController.update)

router.delete('/:id', auth, rolesController.delete)

router.get('/edit/:id', auth, rolesController.edit)

router.get('/', auth, rolesController.index)

module.exports = router
