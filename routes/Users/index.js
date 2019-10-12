const express = require('express')
const router = express.Router()
const auth = require('../../middleware/Auth/jwtValidate')
const userController = require('../../controller/userController')

router.post('/', userController.create)
router.post('/login', userController.login)

router.get('/current', auth, userController.current)
router.get('/', auth, userController.index)

router.put('/:id', auth, userController.update)

router.delete('/:id', auth, userController.delete)

router.get('/edit/:id', auth, userController.edit)

module.exports = router
