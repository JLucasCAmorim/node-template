const mongoose = require('../database')

const Permissions = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
)

module.exports = mongoose.model('Permissions', Permissions)
