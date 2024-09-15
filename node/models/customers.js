const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  username: String,
  name: String,
  address: String,
  birthdate: Date,
  email: String,
  active: Boolean,
  accounts: [Number],
  tier_and_details: mongoose.Schema.Types.Mixed
})

module.exports = mongoose.model('customers',customerSchema)