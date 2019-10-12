const mongoose = require('../database')
const mongoosePaginate = require('mongoose-paginate')

const RoleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    users: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    permissions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Permissions'
      }
    ]
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
)

RoleSchema.index({ name: 1 }, { unique: true })

RoleSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Roles', RoleSchema)
