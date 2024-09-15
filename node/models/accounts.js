const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
  account_id: Number,
  limit: Number,
  products: [String]
})

module.exports = mongoose.model('accounts',accountSchema)