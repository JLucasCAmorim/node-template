var express = require('express')
var router = express.Router()

router.use(require('../../middleware/Auth/jwtValidate'))
router.get('/', function(req, res) {
  res.status(200).send(req.userId)
})

module.exports = router
