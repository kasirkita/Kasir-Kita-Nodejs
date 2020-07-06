const mongoose = require('mongoose')
const schema = mongoose.Schema

const SettingSchema = schema({
    name: String,
    address: String,
    thousand_separator: String,
    decimal_separator: String,
    logo_remove: Boolean,
    logo: String,
    phone_number: String,
    divider: String,
    currency: String,
    tax: Number,
    footer: String,
})

module.exports = Setting = mongoose.model('setting', SettingSchema)