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
    tax: schema.Types.Decimal128,
    footer: String,
})

module.exports = Setting = mongoose.model('Setting', SettingSchema)