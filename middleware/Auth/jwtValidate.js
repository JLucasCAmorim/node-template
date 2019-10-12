const jwt = require('jsonwebtoken')
const hash = require('../../models/config').hash

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization
  // console.log(authHeader)

  if (!authHeader) return res.status(401).send({ error: 'No token provided' })

  const parts = authHeader.split(' ')

  if (!parts.length === 2) return res.status(401).send({ error: 'Token error' })

  const [scheme, token] = parts
  // console.log(parts)
  if (scheme !== 'Bearer')
    return res.status(401).send({ error: 'Token malformated' })

  jwt.verify(token, hash, async (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Token Invalid' })

    req.userId = decoded.id
    req.companyId = decoded.companyId
    return next()
  })
}
