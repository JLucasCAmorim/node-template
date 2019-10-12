const mongoose = require('../database')
const bcrypt = require('bcryptjs')
const mongoosePaginate = require('mongoose-paginate')

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      select: true
    },
    roles: [{ type: mongoose.Schema.ObjectId, ref: 'Roles' }],
    disabled: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
)

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})

UserSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('User', UserSchema)
